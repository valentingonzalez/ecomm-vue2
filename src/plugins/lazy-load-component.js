export default function lazyLoadComponent({
  componentFactory,
  loading,
  loadingData,
}) {
  return () => {
    let resolveComponent;
    let observer;

    return {
      component: new Promise((resolve) => {
        resolveComponent = resolve;
      }),
      loading: {
        mounted() {
          if (!("IntersectionObserver" in window)) {
            // Immediately load the component if
            // `IntersectionObserver` is not available.
            componentFactory().then(resolveComponent);
            return;
          }

          observer = new IntersectionObserver((entries) => {
            if (entries[0].intersectionRatio <= 0) return;
          
            observer.unobserve(this.$el);
            componentFactory().then(resolveComponent);
          }, {
            rootMargin: '0px',
            threshold: 0.1
          });

          observer.observe(this.$el);
        },
        beforeDestroy() {
          if (observer) {
            observer.unobserve(this.$el);
          }
        },
        render(createElement) {
          return createElement(loading, loadingData);
        },
      },
    };
  };
}
