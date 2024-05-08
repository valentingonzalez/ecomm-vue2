<template>
  <div class="card px-4" :class="{ 'opened' : opened }">
    <div class="d-flex justify-content-between align-items-center py-3">
      <div class="d-flex align-items-center">
        <div class="percentage-wrap mr-3">
          <div class="percentage">
            <div class="mask full" :style="`transform: rotate(${percentageCircle}deg)`"><div class="fill" :style="`transform: rotate(${percentageCircle}deg)`"></div></div>
            <div class="mask half"><div class="fill" :style="`transform: rotate(${percentageCircle}deg)`"></div></div>
            <div class="inside-percentage">{{ percentage }}%</div>
          </div>
        </div>
        <h5 class="m-0 font-weight-bold">{{ title }}</h5>
      </div>
      <div class="d-flex align-items-center">
        <router-link :to="{ path: internalLink, query: queryParams }" class="btn btn-sm btn-secondary text-medium font-weight-normal">
          {{ percentage > 0 ? 'Continue' : 'Start' }}
        </router-link>
        <button @click="opened = !opened" class="bg-transparent border-0 ml-3 caret" :class="{ 'invisible' : sections.length <= 1 }" aria-label="Toggle Expand">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 1.5L8 8.5L1 1.5" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
    <div v-show-slide="opened" v-if="sections.length > 1">
      <ul class="sections pl-0 mt-3">
        <li v-for="(s, i) in sections" :key="`s-${i}`" class="d-flex align-items-center justify-content-between mb-4" :class="{ 'pl-4' : !s.completed }">
          <div class="d-flex align-items-center">
            <svg v-if="s.completed" class="mr-3" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.25 10C0.25 4.615 4.615 0.25 10 0.25C15.385 0.25 19.75 4.615 19.75 10C19.75 15.385 15.385 19.75 10 19.75C4.615 19.75 0.25 15.385 0.25 10ZM13.61 8.186C13.67 8.10605 13.7134 8.01492 13.7377 7.91795C13.762 7.82098 13.7666 7.72014 13.7514 7.62135C13.7361 7.52257 13.7012 7.42782 13.6489 7.3427C13.5965 7.25757 13.5276 7.18378 13.4463 7.12565C13.3649 7.06753 13.2728 7.02624 13.1753 7.00423C13.0778 6.98221 12.9769 6.97991 12.8785 6.99746C12.7801 7.01501 12.6862 7.05205 12.6023 7.10641C12.5184 7.16077 12.4462 7.23135 12.39 7.314L9.154 11.844L7.53 10.22C7.38783 10.0875 7.19978 10.0154 7.00548 10.0188C6.81118 10.0223 6.62579 10.101 6.48838 10.2384C6.35097 10.3758 6.27225 10.5612 6.26882 10.7555C6.2654 10.9498 6.33752 11.1378 6.47 11.28L8.72 13.53C8.79699 13.6069 8.8898 13.6662 8.99199 13.7036C9.09418 13.7411 9.20329 13.7559 9.31176 13.7469C9.42023 13.738 9.52546 13.7055 9.62013 13.6519C9.7148 13.5982 9.79665 13.5245 9.86 13.436L13.61 8.186Z" fill="#00A484"/></svg>
            {{ s.title }}
          </div>
          <router-link v-if="s.completed" :to="{ path: `${link}?step=${i + 1}`, query: queryParams }" class="btn btn-sm btn-outline-secondary" style="min-width: 100px;">
            Reconfigure
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'WizardOption',
    props: {
      percentage: {
        default: 0
      },
      title: {
        default: ''
      },
      link: {
        default: '/'
      },
      queryParams: {
        default: ''
      },
      sections: {
        default: () => []
      }
    },
    data() {
      return {
        opened: false
      };
    },
    computed: {
      percentageCircle() {
        return 1.8 * this.percentage;
      },
      internalLink() {
        let index = this.sections.findIndex(x => !x.completed) == -1 ? Math.ceil(this.percentage * this.sections.length / 100) + 1 : this.sections.findIndex(x => !x.completed) + 1;
        return index ? `${this.link}?step=${index > this.sections.length ? this.sections.length : index}` : this.link;
      }
    }
  };
</script>

<style scoped lang="scss">

  .percentage-wrap {
    width: 52px;
    height: 52px;
    background: #CBD5E1;
    border-radius: 50%;
    .percentage {
      .mask,
      .fill {
        width: 52px;
        height: 52px;
        position: absolute;
        border-radius: 50%;
      }
      .mask {
        clip: rect(0px, 52px, 52px, 26px);
      }
    }
    .inside-percentage {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: #fff;
      line-height: 48px;
      text-align: center;
      margin-top: 3px;
      margin-left: 3px;
      position: absolute;
      z-index: 100;
      font-weight: 700;
      font-size: 11px;
    }
  }
  .mask .fill {
    clip: rect(0px, 26px, 52px, 0px);
    background-color: #10B981;
  }
  .mask.full,
  .percentage .fill {
    animation: fill ease-in-out 3s;
  }

  .sections {
    list-style: none;
    font-size: 18px;
  }

  .caret {
    transition: transform .2s;
  }
  .opened .caret {
    transform: rotate(180deg);
  }

</style>