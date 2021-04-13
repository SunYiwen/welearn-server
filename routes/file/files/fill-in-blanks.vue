<template>
  <view class="component fill-in-blanks">
    <view class="fill-in-blanks-desc">
      <view class="fill-in-blanks-type">填空</view>
      <view class="fill-in-blanks-desc">
        <view v-for="(descItem, index) in processedDesc" :key="index">
          <template v-if="!descItem">
            <text class="fill-in-blanks-blank fill">{{ placeholder }}</text>
          </template>
          <template v-else>
            <text class="fill-in-blanks-text">{{ descItem }}</text>
            <text v-if="index !== processedDesc.length - 1" class="fill-in-blanks-blank fill hh">{{ placeholder }}</text>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
/**
 * @name 配套小题-填空
 * @author howietang
 **/
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { ChineseQuizItem } from '@/api-v2/task';

@Component
export default class FillInBlanks extends Vue {
  /** 题目信息 */
  @Prop({ default: {} }) quizItem!: ChineseQuizItem;

  /* 处理过的题干数据 */
  processedDesc: string[] = [];

  /* 占位符 */
  placeholder = '昆虫';

  /* 初始化组件 */
  created() {
    // 题干数据拆分
    this.initDesc();
  }

  /* 处理填空题干 */
  initDesc() {
    const desc = this.quizItem?.Desc || '';
    const descItems = desc.split(' ');

    this.processedDesc = descItems;
  }
}
</script>

<style lang="scss" scoped>
.fill-in-blanks {
  &-type {
    position: relative;
    top: -2px;
    border-radius: 12px;
    padding: 4px 8px;
    margin-right: 6px;
    font-size: 14px;
    line-height: 32px;
    font-weight: 500;
    color: #556ce8;
    background: rgba(85, 108, 232, 0.1);
  }

  &-desc {
    display: flex;
    flex-wrap: wrap;
  }

  &-blank {
    border: 2px solid #556ce8;
    color: white;
    background: white;
    border-radius: 4px;
    display: inline-block;
    margin: 0 4px;
    padding: 1px 4px;

    &.fill {
      background: #556ce8;
    }
  }
}
</style>
