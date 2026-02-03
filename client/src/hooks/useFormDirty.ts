import { useEffect, useMemo } from "react";

/**
 * A reusable hook to track if a form has unsaved changes by comparing
 * current state against initial values.
 * * @param currentValues - The current state object of the form
 * @param initialValues - The starting state object (usually from props)
 * @param onDirtyChange - Callback to notify a parent component (like a Modal)
 */
export function useFormDirty<T extends Record<string, any>>(
  currentValues: T,
  initialValues: T,
  onDirtyChange?: (isDirty: boolean) => void
) {
  // Memoize the comparison to avoid unnecessary recalculations on every render
  const isDirty = useMemo(() => {
    // Standard deep comparison via stringification for simple form objects
    return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
  }, [currentValues, initialValues]);

  // Sync the dirty state with the parent component whenever it changes
  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  return isDirty;
}
