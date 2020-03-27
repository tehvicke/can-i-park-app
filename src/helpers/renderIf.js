export const renderIf = (condition, content) => {
  if (condition) {
    console.log('japp!');
    return content;
  } else {
    console.log('näpp!');
    return null;
  }
};
