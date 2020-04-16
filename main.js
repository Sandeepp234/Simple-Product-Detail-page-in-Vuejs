var eventBus = new Vue()


Vue.component('product',{
    props:{
            premium: {
                type: Boolean, 
                required: true
            }
    },
    template:`
    <div class="product">
          <div class="product-image">
            <img v-bind:src="image" />
            <!-- This v-bind dynamically binds an attribute(src) to an expression(image) -->
          </div>
          <div class="product-info">
            <h1>{{title}}</h1>
          <p v-if="instock ">In stock </p>
          <p v-else>Out of stock </p>
          <p>Shipping: {{ shipping}}
          <ul>
            <li v-for="detail in details">{{detail}} </li>
          </ul>
            
          <div v-for="(variant,  index) in variants"
          :key="variant.variantId"
          class="color-box"
          :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">

    

            <!--The v-for directive allows us to loop over an array and render data from within it.-->
            <!-- {{ }} expression --> 

          </div>

          <button v-on:click="addToCart" 
                  :disabled="!instock"
                  :class="{disabledButton: !instock}"
          >
            Add to Cart
          </button>


        </div>

        <product-tabs :reviews="reviews"></product-tabs>

        <div>

      




        `,
        data(){
            return {
            
                brand:'Vue Mastery',
                product: 'Socks',
             //   image:'assets/greensocks.jpg',
                selectedVariant:0,
                //instock: false,
                details: ["80% cotton", "20% polyster", "Gender-neutral"],
                variants:[
        
                    {
                        variantId:2234,
                        variantColor:"green",
                        variantImage:'assets/greensocks.jpg',
                        variantQuantity: 10 
                    },
        
                    {
                        variantId: 2235,
                        variantColor:"blue",
                        variantImage:'assets/bluesocks.jpg',
                        variantQuantity: 0
                   }
                ],

                reviews:[]
        
        
                
            }
        }, 
    
        methods:{
    
            addToCart: function(){
               // this.cart += 1
               this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            },
    
            updateProduct: function (index) {
    
                this.selectedVariant = index
                console.log(index)
       
            }
            
        },
        computed: {
            title(){
                return this.brand + ' ' + this.product
            },
    
            image(){
                return this.variants[this.selectedVariant].variantImage
            },
    
            instock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            shipping(){
                if (this.premium){
                    return "Free"

                }
                return 2.99
            }
    
        },

        mounted() {
            eventBus.$on('review-sumitted', productReview => {
                this.reviews.push(productReview)
            })
        }

})

Vue.component('product-review',{
    template:`
    <form class="review-form" @submit.prevent="onSubmit">

        <p v-if="error.length">

        <b> Please correct the following errors:</b>
        <ul>

        <li v-for="error in error">{{ error }} 
        

        
        </li>

        
        </ul>
        
        
        
        </p>


      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>

    `,

    data(){
        return{
            name:null,
            review:null,
            rating:null,
            error:[]
        
        }
    },
    methods: {
        onSubmit(){
            if(this.name && this.review && this.rating){

                let productReview = {
                    name:this.name,
                    review:this.review,
                    rating:this.rating
                }
                eventBus.$emit('review-sumitted', productReview)
                this.name =null
                this.review = null
                this.rating=null

            }

        else{
            if(!this.name) this.error.push("Name Required.")
            if(!this.review) this.error.push("Review Required.")
            if(!this.rating) this.error.push("Rating Required.")
        }
          
        }
       
    }
})

Vue.component('product-tabs',{

    props:{
            reviews: {
                type: Array,
                required:true

            }
    },

    template:`

        <div>
        <span class="tab"
        :class="{ activeTab: selectedTab === tab }"
        v-for="(tab, index) in tabs" :key="index"
        @click="selectedTab = tab" >
        {{ tab }}
        </span>

        <div v-show="selectedTab === 'Reviews'">

    
        <p v-if="!reviews.length">There is no reviews yet.</p>
        <ul v-else>
        <li v-for="(review, index) in reviews" :key="index">

        <p>{{ review.name }}</p>    
        <p>Rating: {{ review.rating }}</p>
        <p>{{ review.review }}</p>
        </li>

        
        </ul>


        </div>
        
        <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        
        </div>


    `,
    data(){
        return{
            tabs:['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({

    el:'#app',

    data: {
        premium: false,
        cart:[]
    },

    methods:{
        updateCart(id){
            this.cart.push(id)
        }
    }
   


})