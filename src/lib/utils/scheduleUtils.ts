export function computeScheduleExpiryIso(
  scheduledIso: string,
  liveUntil: string,
  endDate?: string,
  endTime?: string,
): string {
  const scheduled = new Date(scheduledIso);
  if (Number.isNaN(scheduled.getTime())) {
    throw new Error('Invalid schedule date or time');
  }

  switch (liveUntil) {
    case 'always': {
      const farFuture = new Date(scheduled);
      farFuture.setFullYear(farFuture.getFullYear() + 10);
      return farFuture.toISOString();
    }
    case '1w':
      return addDays(scheduled, 7).toISOString();
    case '2w':
      return addDays(scheduled, 14).toISOString();
    case '3w':
      return addDays(scheduled, 21).toISOString();
    case '1m':
      return addMonths(scheduled, 1).toISOString();
    case 'custom': {
      if (!endDate || !endTime) {
        throw new Error('Please select end date and time');
      }
      const expiry = new Date(`${endDate}T${endTime}`);
      if (Number.isNaN(expiry.getTime())) {
        throw new Error('Invalid end date or time');
      }
      if (expiry <= scheduled) {
        throw new Error('End date and time must be after the schedule date and time');
      }
      return expiry.toISOString();
    }
    default:
      return addDays(scheduled, 7).toISOString();
  }
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}
