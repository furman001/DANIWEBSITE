-- ============================================================
-- ATOMIC DEPOSIT APPROVAL / REJECTION RPCs
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Fixes: double-credit, race conditions, partial-failure rollback
-- ============================================================

-- 1. APPROVE deposit: atomic, idempotent
CREATE OR REPLACE FUNCTION public.approve_deposit(txn_id uuid)
RETURNS json AS $$
DECLARE
  txn record;
  caller_role text;
BEGIN
  -- Verify caller is admin
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only admins can approve deposits';
  END IF;

  -- Lock the transaction row to prevent race conditions
  SELECT * INTO txn
  FROM public.wallet_transactions
  WHERE id = txn_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  -- Idempotency: already approved → no-op (prevents double-credit)
  IF txn.status = 'approved' THEN
    RETURN json_build_object('status', 'already_approved', 'amount', txn.amount);
  END IF;

  IF txn.type <> 'deposit' THEN
    RAISE EXCEPTION 'Only deposit transactions can be approved';
  END IF;

  -- Atomic: update status + credit balance in single transaction
  UPDATE public.wallet_transactions
  SET status = 'approved'
  WHERE id = txn_id;

  UPDATE public.users
  SET wallet_balance = COALESCE(wallet_balance, 0) + txn.amount
  WHERE id = txn.user_id;

  RETURN json_build_object('status', 'approved', 'amount', txn.amount, 'user_id', txn.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. REJECT deposit: atomic, idempotent.
--    If a previously approved deposit is rejected, also debits the balance.
CREATE OR REPLACE FUNCTION public.reject_deposit(txn_id uuid)
RETURNS json AS $$
DECLARE
  txn record;
  caller_role text;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Only admins can reject deposits';
  END IF;

  SELECT * INTO txn
  FROM public.wallet_transactions
  WHERE id = txn_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  IF txn.status = 'rejected' THEN
    RETURN json_build_object('status', 'already_rejected');
  END IF;

  -- If reversing an approval, debit the balance
  IF txn.status = 'approved' AND txn.type = 'deposit' THEN
    UPDATE public.users
    SET wallet_balance = GREATEST(COALESCE(wallet_balance, 0) - txn.amount, 0)
    WHERE id = txn.user_id;
  END IF;

  UPDATE public.wallet_transactions
  SET status = 'rejected'
  WHERE id = txn_id;

  RETURN json_build_object('status', 'rejected', 'amount', txn.amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (function still checks admin role internally)
GRANT EXECUTE ON FUNCTION public.approve_deposit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_deposit(uuid) TO authenticated;
