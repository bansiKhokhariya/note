export const confirmUnsavedChanges = () => {
  return new Promise((resolve) => {
    const userChoice = window.confirm('You have unsaved changes. Do you really want to leave?');
    resolve(userChoice ? 'ok' : 'cancel');
  });
};