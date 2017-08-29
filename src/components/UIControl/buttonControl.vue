<template>
    <el-button :class="typeClass" @click="touchUpInside" :disabled="disabled">
        <i class="iconfont" :class="icon" style="margin-right: 5px;" v-if="icon != ''"></i>{{ buttonText }}
    </el-button>
</template>
<!-- <k-button type="text" text="正常按钮" @click="test"></k-button>
<k-button text="Hello" @click="test"></k-button>
<k-button type="warning" text="Hello" @click="test"></k-button>
<k-button type="default" text="Hello" @click="test"></k-button>
<k-button type="danger" text="正常按钮" @click="test"></k-button>
<k-button type="danger" icon="icon-close" text="正常按钮" @click="test" style="width: 80px;"></k-button>
<k-button type="danger" icon="icon-close" text="两字" @click="test"></k-button>
<k-button type="danger" icon="icon-close" text="Hello" @click="test"></k-button>
<k-button :disabled="true" type="danger" icon="icon-close" text="三个字" @click="test"></k-button> -->
<script>
    export default {
        props: {
            text: {
                type: String
            },
            type: {
                type: String,
                default: 'default'
            },
            disabled: {
                default: false
            },
            icon: {
                default: ''
            }
        },
        data() {
		    return {
                buttonText: this.text
		   	}
		},
        mounted: function() {
            if(this.$store.state.themeModel){
                require('../../assets/css/cool.css')
            }else{
                require('../../assets/css/classic.css')
            }
	    },
        computed: {
            typeClass: function (){
                return {
                    'button-default': this.type === 'default',
                    'button-warning': this.type === 'warning',
                    'button-danger': this.type === 'danger',
                    'button-text': this.type === 'text',
                    'button-disabled': this.disabled === true
                }
            }
        },
        methods: {
            touchUpInside(...args) {
                this.$emit('click', ...args);
            }
        }
    }
</script>

<style>
    /********   Button   ************/
    .button-default{
        width: 70px;
        height: 30px;
        font-size: 12px;
        padding: 0;
        color: #d7d5d5 !important;
        background-color: rgba(39, 157, 218, 0.3);
        border: 1px solid #279dda !important;
        border-radius: 0 !important;
    }
    .button-default:hover{
        background-color: rgba(39, 157, 218, 0.8);
        border: 1px solid #279dda;
        color: #d7d5d5;
    }
    .button-default:active{
        background-color: rgba(39, 157, 218, 0.6);
        border: 1px solid #279dda;
        color: #d7d5d5;
    }

    .button-warning{
        width: 70px;
        height: 30px;
        font-size: 12px;
        padding: 0;
        color: #d7d5d5 !important;
        background-color: rgba(242, 144, 25, 0.3);
        border: 1px solid #F29019 !important;
        border-radius: 0 !important;
    }
    .button-warning:hover{
        background-color: rgba(242, 144, 25, 0.8);
        border: 1px solid #F29019;
        color: #d7d5d5;
    }
    .button-warning:active{
        background-color: rgba(242, 144, 25, 0.6);
        border: 1px solid #F29019;
        color: #d7d5d5;
    }

    .button-danger{
        width: 70px;
        height: 30px;
        font-size: 12px;
        padding: 0;
        color: #d7d5d5 !important;
        background-color: rgba(234, 85, 76, 0.3);
        border: 1px solid #ea554c !important;
        border-radius: 0 !important;
    }
    .button-danger:hover{
        background-color: rgba(234, 85, 76, 0.8);
        border: 1px solid #ea554c;
        color: #d7d5d5;
    }
    .button-danger:active{
        background-color: rgba(234, 85, 76, 0.6);
        border: 1px solid #ea554c;
        color: #d7d5d5;
    }

    .button-text{
        width: 70px;
        height: 30px;
        font-size: 12px;
        padding: 0;
        color: #d7d5d5 !important;
        background-color: transparent;
        border: none !important;
        border-radius: 0 !important;
    }
    .button-text:hover{
        color: #279dda !important;
    }
    .button-text:active{
        color: #279dda !important;
        opacity: 0.9;
    }

    .button-disabled{
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid #666 !important;
        color: #999 !important;
        cursor: context-menu !important;
    }
    /********   Button   ************/
</style>
