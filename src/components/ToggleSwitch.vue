<template>
  <div class="toggle-switch">
     <label class="--switch">
      <input type="checkbox" :checked="setStatus">
      <span class="--slider"></span>
    </label>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'

export default {
  props: {
    currentStatus: {
      type: String,
    }
  },
  setup (props) {
    const setStatus = computed(() => {
      return props.currentStatus === 'open' || props.currentStatus === 'published'
    })

    return {
      setStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle-switch {
  .--switch {
    position: relative;
    display: inline-block;
    width: 70px;
    height: 35px;
  }

  .--switch input {
    display:none;
  }

  .--slider .fa-check {
    color: #FFFFFF;
    position:absolute;
    left:15px;
    font-size:16px;
    display:none;
  }
  .--slider .fa-times {
    color: #FFFFFF;
    position:absolute;
    font-size:16px;
    right:15px; 
  }

  .--slider {
    position: absolute;
    cursor: pointer;
    display:flex;
    align-items:center;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: #D1D1D6;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius:50px;
  }

  .--slider:before {
    position: absolute;
    content:"";
    height: 27px;
    width: 27px;
    left: 4px;
    bottom: 4px;
    border-radius:50%;
    background-color: #666666;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .--switch input:checked + .--slider .fa-check {
    display:block;
  }

  .--switch input:checked + .--slider .fa-times {
    display:none;
  }

  .--switch input:checked + .--slider {
    background-color: #ECF2EC;
  }

  .--switch input:checked + .--slider:before {
    background-color: #40BB15;
  }

  .--switch input:focus + .--slider {
    box-shadow: 0 0 1px #52b69a;
  }

  .--switch input:checked + .--slider:before {

    -webkit-transform: translateX(35px);
    -ms-transform: translateX(35px);
    transform: translateX(35px);
  }
}


</style>