export const STRING_NORMALISER = {
  trim: true,
  undefinedIfEmpty: true
};

export const HTML_NORMALISER = {
  trim: true,
  sanitizeHtml: true,
  undefinedIfEmpty: true
};

export const BASIC_ARRAY_NORMALISER = {
  undefinedIfEmpty: true
};

export const IMAGES_NORMALISER = {
  ...BASIC_ARRAY_NORMALISER,
  each: {
    object: {
      copyright: STRING_NORMALISER,
      dominantColor: STRING_NORMALISER
    }
  }
};

export const LINKS_NORMALISER = {
  ...BASIC_ARRAY_NORMALISER,
  each: {
    object: {
      url: STRING_NORMALISER
    }
  }
};
