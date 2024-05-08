class BreadcrumbMonitor {
  capture(from, to) {
    let state = { from, to };
    this.push(state);
  }
  slugify(title) {
    return title.toLowerCase().replace(/\//g, ' ').replace(/&/g, ' and ').replace(/[^a-z0-9_ -]/g, '').replace(/\s+/g, '-');
  }

  getBreadcrumbs(product,departments_hierarchy_level) {
    let states = this.getHistory();
    let currentPage = this.getLastItem(states);
    let breadcrumbs = [];


    if(this.isProductPage(currentPage.to.meta.type)) {
      // TODO: it will be more distinct chacks like depart, class, etc
      // adding product state
      let productState = this.generateState(product.title, `/products/${product.id}/${product.title}`);
      breadcrumbs.push(productState);

      if(currentPage.from.path === '/') {
        return this.freshState(product, breadcrumbs);
      } else if(this.isDepartment(currentPage.from.meta.type)) {
        if(this.hasClass(currentPage.from) && product.class_name && product.class_id) {
          let className = product.class_name;
          let classPath = currentPage.from.fullPath;

          if(currentPage.from.query.hasOwnProperty('dept_id')) {
            classPath = classPath.replace(`dept_id=${currentPage.from.query.dept_id}`, `dept_id=${product.class_id}`);
          }
          if(this.hasFineline(currentPage.from)) {
            classPath = currentPage.from.fullPath.replace(`&exsubdept=${currentPage.from.query.exsubdept}`, '');
          }
          if(product.fineline_name && product.fineline_id) {
            let finelineName = product.fineline_name;
            let finelineState = this.generateState(finelineName, currentPage.from.fullPath);
            if(currentPage.from.query.hasOwnProperty('dept_id')) {
              finelineState.path = finelineState.path.replace(`dept_id=${currentPage.from.query.dept_id}`, `dept_id=${product.fineline_id}`);
            }
            breadcrumbs.push(finelineState);
          }

          let classState = this.generateState(className, classPath);
          breadcrumbs.push(classState);
        }
        let departmentPath = currentPage.from.fullPath;

        if(this.hasFineline(currentPage.from)) {
           departmentPath = departmentPath.replace(`&exsubdept=${currentPage.from.query.exsubdept}`, '');
        }
        if(this.hasClass(currentPage.from)) {
          departmentPath = departmentPath.replace(`&exdept=${currentPage.from.query.exdept}`, '');
        }
        let departmentState = this.generateState(product.dept_name, departmentPath);
        breadcrumbs.push(departmentState);

      } else if(this.hasComeFromBrandPage(currentPage.from)) {
        const brandPage = this.generateState('Brands', '/brands');
        const brandState = this.generateState(product.brand_name, currentPage.from.fullPath);

        breadcrumbs.push(brandState);
        breadcrumbs.push(brandPage);
      } else if(this.hasComeFromRentalsPage(currentPage.from)) {
        let rentalsState = this.generateState(product.dept_name, `/rentals?deptId=${product.dept_id}`);
        breadcrumbs.push(rentalsState);
      } else {
        return this.freshState(product, breadcrumbs,departments_hierarchy_level);
      }
    }
    return breadcrumbs.reverse();
  }
  hasComeFromBrandPage(state) {
    return state.meta.type === 'brand' || state.meta.type === '/brand';
  }
  hasComeFromRentalsPage(state) {
    return state.meta.type === 'rentals' || state.meta.type === '/rentals';
  }
  isBrandDepartment(state) {
    return (state.meta.type === 'department' || state.meta.type === '/department') && state.test(/department\/\d.*\/brands/);
  }
  hasClass(state) {
    // exdept is class
    // exsubdept is fineline name
    return state.query.hasOwnProperty('exdept');
  }
  hasFineline(state) {
    // exdept is class
    // exsubdept is fineline name
    return state.query.hasOwnProperty('exsubdept');
  }
  isDepartment(type) {
    return type === 'department';
  }
  generateState(name, path) {
    return { text: name.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()), path: path };
  }
  freshState(product, breadcrumbs) {
    if(product.dept_id && product.dept_name) {
      //let departmentPath = "/department/" + product.dept_id + "/" + product.dept_name;
      let departmentPath = `/department/${this.slugify(product.dept_name)}-${product.dept_id}?name=${encodeURIComponent(product.dept_name)}`;
      if(product.fineline_name && product.fineline_id && product.class_id) {
        let finelineName = product.fineline_name;
        let finelineState = this.generateState(finelineName, departmentPath);
        finelineState.path = `${finelineState.path}&in_stock_only=0&exdept=${product.class_id}&exsubdept=${product.fineline_id}&dept_id=${product.fineline_id}`;
        breadcrumbs.push(finelineState);
      }

      if(product.class_id && product.class_name) {
        let className = product.class_name;
        let classState = this.generateState(className, departmentPath);
        classState.path = `${classState.path}&in_stock_only=0&exdept=${product.class_id}&dept_id=${product.class_id}`;
        breadcrumbs.push(classState);
      }

      let departmentState = this.generateState(product.dept_name, departmentPath);
      breadcrumbs.push(departmentState);
    } else if(product.brand_name && product.brand_id) {
      let brandState = this.generateState(product.brand_name, `/brands/${product.brand_id}`);
      breadcrumbs.push(brandState);
    }
    return breadcrumbs.reverse();
  }
  isValidReferrer(pageType) {
    return (
      pageType === 'department' ||
      pageType === 'class' ||
      pageType === 'fineline' ||
      pageType === 'brand'
    );
  }
  isProductPage(pageType) {
    return pageType === 'product';
  }
  getLastItem(arr) {
    return arr.length ? arr[arr.length - 1] : [];
  }
  push(state) {
    let states = this.getHistory();
    states.push(state);
    if(states.length >= 10) {
      delete states[0];
    }
    this.setHistory(Object.values(states));
  }
  getHistory() {
    return window.routeHistory ? window.routeHistory : [];
  }
  setHistory(history) {
    window.routeHistory = history;
  }
}

export default new BreadcrumbMonitor;
