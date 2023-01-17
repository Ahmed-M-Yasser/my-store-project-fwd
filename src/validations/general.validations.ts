export const isIdValid = (id: unknown, source: string): string => {
  try {
    if (id === undefined || (id as string) === '') return source + ' id must be provided.';

    return 'valid';
  } catch (error) {
    throw new Error('Bad request: ' + (error as Error).message + '.');
  }
};
