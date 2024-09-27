export const getDataURLFromFiles = async (...files: File[]) => {
  const promises = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject();
          }
        };
      }),
  );
  const urls = await Promise.all(promises);
  return urls;
};
