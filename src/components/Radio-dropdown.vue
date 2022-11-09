<template>
  <div 
  class="radio-dropdown"
  :style="{ cursor: isAdminRole ? 'initial' : 'pointer' }"
  >
    <div 
      class="current-item"
      :class="{ disabled: isAdminRole }"
      @click="
        $emit('toggleDropdown', 
        optionNameId, 
        !statusDropdown, 
        isAdminRole)
      "
    >
      {{ currentStatus }}
    </div>
    <div
      class="back-layer" 
      @click="$emit('toggleDropdown', optionNameId, false)" 
      :class="{ 'active-back' : isDropDownOpened }"
    />
    <div 
      class="arrow"
      :class="{ active : isDropDownOpened }"
      v-if="!isAdminRole"
      @click="
        $emit('toggleDropdown', 
        optionNameId, 
        !statusDropdown, 
        isAdminRole)
      "
    >
      <img src="../assets/images/arrow-down.svg" alt="">
    </div>
    <ul 
      class="list-of-items"
      :class="{ active : isDropDownOpened }"
    >
      <li 
        v-for="option in options"
        :key="option.id"
      >
        <label class="radio">
          <input 
            type="radio" 
            :name="optionNameId" 
            :checked="option.value === currentItem"
            :value="option.value"
            @change="
              onChange($event), 
              $emit('newValue', optionNameId, $event.target._value, starRating)
            "
          >
          <span></span> {{ option.name }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'radio-dropdown',
  props: {
    options: {
      type: Array,
      default: []
    },
    currentItem: {
      type: String,
      default: ''
    },
    optionNameId: {
      type: Number
    },
    starRating: {
      type: Number
    },
    statusDropdown: {
      type: Boolean
    },
    isAdminRole: {
      type: Boolean
    }
  },
  setup (props) {
    console.log(props.currentItem)
    const currentStatus = ref('')
    const isDropDownOpened = ref(false)
    isDropDownOpened.value = props.statusDropdown

    const onChange = e => {
      currentStatus.value = e.target._value
      isDropDownOpened.value = false
    }

    watch(() => props.statusDropdown, () => {
      isDropDownOpened.value = props.statusDropdown
    })

    watch(() => props.currentItem, () => {
      currentStatus.value = props.currentItem
    })

    onMounted(() => {
      currentStatus.value = props.currentItem
    })


    return {
      currentStatus,
      onChange,
      isDropDownOpened
    }
  }
  
}
</script>

<style lang="scss" scoped>
.back-layer {
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.active-back {
  display: block;
}
  .radio-dropdown {
    width: 100%;
    position: relative;

    .current-item {
      text-align: left;
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100px;

      &.disabled {
        color: #b9b9b9;
      }
    }

    .arrow {
      position: absolute;
      top: 0;
      right: 0;

      &.active {
        transform: rotate(180deg);
      }
    }

    .list-of-items {
      overflow: hidden;
      height: 0;
      background: #fff;
      z-index: 10;
      position: absolute;
      right: 0;

      li {
        padding: 15px 19px;
        
        label {
          display: flex;
          align-items: center;
          cursor: pointer;

          input {
            display: none;
          }
          span {
            position: relative;
            display: inline-block;
            min-width: 16px;
            min-height: 16px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid #40BB15;
            margin-right: 17px;
            box-sizing: border-box;
          }
          input:checked + span { 
            background: #fff;
          }
          input:checked + span::before { 
            content: '';
            position: absolute;
            left: 2px;
            top: 2px;
            background: #40BB15;
            width: 8px; 
            height: 8px;
            border-radius: 50%;
          }
        }
      }

      &.active {
        height: auto;
      }
    }
  }
</style>