//                         //
// Basic app configuration //
//                         //
const API_URL = ""

//                      //
// Component definition //
//                      //

// Pages //

// Book Selection Page
const bookSelectionPage = Vue.component('book-selection', {
  template: '#book-selection',

  data () {
    return {
      bookname: ''
    }
  }
})

// Leaves page
const leavesPage = Vue.component('leaves-page', {
  template: '#leaves-page',

  computed: {
    leaves () {
      return this.$store.getters.bookLeaves
    },
    loading () {
      return this.$store.getters.loading
    },
    bookname () {
      return this.$store.getters.bookname
    }
  },

  created () {
    this.$store.dispatch('fetchBookLeaves', this.$route.params.book)
  }
})

// Components //

// Autoresize textarea

const autoarea = Vue.component('autoarea', {
  template: '#autoarea',

  props: [
    'value',
    'handleChange'
  ],

  mounted () {
    autosize(this.$el)
  }
})

// Leaf component
const leaf = Vue.component('leaf', {
  template: '#leaf-template',

  props: [
    'id',
    'title',
    'content'
  ],

  methods: {
    handleChange(e) {
      this.text = e.target.value
    }
  }
})

//                   //
// Router definition //
//                   //

const router = new VueRouter ({
  routes: [
    {
      path: '/',
      name: 'home',
      component: bookSelectionPage
    },
    {
      path: '/leaves/:book',
      name: 'leaves',
      component: leavesPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

//                  //
// Store definition //
//                  //

const store = new Vuex.Store({
  state: {
    leaves: [],
    bookname: '',
    loading: false
  },

  mutations: {
    SET_LOADING (state) {
      state.loading = true
    },

    SET_NOT_LOADING (state) {
      state.loading = false
    },

    SET_BOOKNAME (state, bookname) {
      state.bookname = bookname
    },

    INITIALIZE (state, leaves) {
      state.leaves = leaves
    }
  },

  actions: {
    fetchBookLeaves (state, bookname) {
      store.commit('SET_BOOKNAME', bookname)
      store.commit('SET_LOADING')
      axios
        .get(API_URL + store.getters.bookname)
        .then( response => {
          store.commit('SET_NOT_LOADING')
          if (response.data.leaves) store.commit('INITIALIZE', response.data.leaves)
        })
    }
  },

  getters: {
    bookLeaves: state => {
      return state.leaves
    },

    loading: state => {
      return state.loading
    },

    bookname: state => {
      return state.bookname
    }
  }
})

//                //
// Vue definition //
//                //

var vm = new Vue({
  el: '#app',
  store: store,
  router: router
})
