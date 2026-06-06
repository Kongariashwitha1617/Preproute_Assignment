interface NamedEntity {
  id: string;
  name: string;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function filterValidUuids(values: string[]): string[] {
  return values.filter(isValidUuid);
}

/** Map API values that may be UUIDs or display names to option IDs. */
export function resolveToIds(values: string[], options: NamedEntity[]): string[] {
  return values
    .map((value) => {
      if (isValidUuid(value) && options.some((item) => item.id === value)) return value;
      const byName = options.find((item) => item.name === value);
      return byName?.id ?? '';
    })
    .filter(Boolean);
}

export function resolveSubjectId(subjectValue: string, subjects: NamedEntity[]): string {
  if (subjects.some((s) => s.id === subjectValue)) return subjectValue;
  return subjects.find((s) => s.name === subjectValue)?.id ?? subjectValue;
}

/** Questions API expects display names, not UUIDs, for topic/sub_topic fields. */
export function resolveIdToName(
  value: string | undefined,
  options: NamedEntity[],
): string | undefined {
  if (!value) return undefined;
  const byId = options.find((item) => item.id === value);
  if (byId) return byId.name;
  const byName = options.find((item) => item.name === value);
  if (byName) return byName.name;
  return value;
}
