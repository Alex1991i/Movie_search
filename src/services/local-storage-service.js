class LocalStorageService {
  setValue = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      throw new Error('Yps!!!!!!!!');
    }
  };

  getValue = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      throw new Error('Yps!!!!!!!!');
    }
  };
}

const localStorageService = new LocalStorageService();

export default localStorageService;
