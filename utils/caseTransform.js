export function camelToSnakeCase(object, fieldsToRemove) {
  if (Array.isArray(object)) {
    const camelCasedObjects = [];

    object.forEach((single) => camelCasedObjects.push(camelToSnakeCase(single)));

    return camelCasedObjects;
  }

  const disallowedFields = fieldsToRemove || [];
  const snakeCasedObject = {};

  const caseTransform = (str) => str.replace(/[A-Z0-9]/g, (letter) => `_${letter.toLowerCase()}`);

  Object.keys(object).forEach((key) => {
    if (!disallowedFields.includes(key) && object[key] !== '') {
      snakeCasedObject[caseTransform(key)] = object[key];
    }
  });

  return snakeCasedObject;
}

export function snakeToCamelCase(object) {
  if (Array.isArray(object)) {
    const camelCasedObjects = [];

    object.forEach((single) => camelCasedObjects.push(snakeToCamelCase(single)));

    return camelCasedObjects;
  }

  const camelCasedObject = {};

  const caseTransform = (str) =>
    str.replace(/([-_][a-z0-9])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );

  Object.keys(object).forEach((key) => {
    camelCasedObject[caseTransform(key)] = object[key] == null ? '' : object[key];
  });

  return camelCasedObject;
}
