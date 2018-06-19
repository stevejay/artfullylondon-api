export const IMAGES_NORMALISER = {
  undefinedIfEmpty: true,
  each: {
    object: {
      copyright: {
        trim: true,
        undefinedIfEmpty: true
      },
      dominantColor: {
        trim: true,
        undefinedIfEmpty: true
      }
    }
  }
};

export const LINKS_NORMALISER = {
  undefinedIfEmpty: true,
  each: {
    object: {
      url: {
        trim: true
      }
    }
  }
};

export const NAME_NORMALISER = {
  trim: true
};

export const DESCRIPTION_NORMALISER = {
  trim: true,
  undefinedIfEmpty: true
};

export const DESCRIPTION_CREDIT_NORMALISER = {
  trim: true,
  undefinedIfEmpty: true
};

export const WE_SAY_NORMALISER = {
  trim: true,
  undefinedIfEmpty: true
};

export const NOTES_NORMALISER = {
  trim: true,
  undefinedIfEmpty: true
};

export const SUMMARY_NORMALISER = {
  trim: true
};
