const paginationConfig = {
  bootstrapPaginationClasses: {
    ul: 'pagination justify-content-center',
    li: 'page-item',
    liActive: 'active',
    liDisable: 'disabled',
    button: 'page-link'
  },
  paginationAnchorTexts: {
    prev: 'Previous',
    next: 'Next',
  },
  maxVisibleButtons: 3
};

const playerConfig = {
  autoplay: false,
  muted: false,
  language: 'en',
  playbackRates: [ 0.7, 1.0, 1.5, 2.0 ],
  sources: [{
    type: 'video/mp4',
    src: null
  }],
  poster: null
};

export {
  paginationConfig,
  playerConfig
};
