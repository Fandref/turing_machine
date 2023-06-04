<template>
  <div class="problem">
      <h4 class="problem-head"><span class="line">{{line}}</span> стрічка</h4>
      <p class="problem-description">{{problem}}</p>
  </div>
</template>

<script>
export default {
    props:{
        line:{
            type: Number,
            required: true
        },
        problem:{
            type: String,
            required: true
        },

    }
}
</script>

<style lang="scss" scoped>
    .problem{
        margin-bottom: 16px;
        .problem-head{
            margin-bottom: 6px;
            color: $gray;
            .line{
                color: $danger-color;
            }
        }
        .problem-description{
            margin: 0;
        }
    }
</style>