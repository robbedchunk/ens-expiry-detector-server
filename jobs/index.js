const getThreeCharacterDomains = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const domains = [];

  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      for (let k = 0; k < chars.length; k++) {
        domains.push(chars[i] + chars[j] + chars[k]);
      }
    }
  }

  return domains;
}

// const updateDatabaseRecords = () => {
//   const domains = getThreeCharacterDomains();

//   for (let i = 0; i < domains.length; i++) {
//     const domain = domains[i];

//   }
// }