export { default as cn } from './cn';
export { default as logger } from './logger';

export const languages = [
  'java', 'c', 'markdown', 'css', 'html', 'xml', 'bash', 'json', 'yaml',
  'jsx', 'python', 'c++', 'javascript', 'csharp', 'php', 'typescript',
  'swift', 'objectivec', 'sql', 'r', 'kotlin', 'ruby', 'go',
];

export const removeFocusRings =
  'focus:outline-none focus:ring-0 focus:ring-opacity-0 focus:ring-offset-0';

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
