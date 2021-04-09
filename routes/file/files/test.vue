<template>
  <view class="test">
    <group-item :groupInfo="groupInfo" :memberList="memberList" />
  </view>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import groupItem from '@/package-home/components/group-item/group-item.vue';
import { getGroupDetailAPI, getMemberListAPI } from '@/api/group';
import { Group } from '@/store/account';
import { BriefGroupMemberInfo } from '@/api-v2/group';

@Component({
  components: {
    groupItem,
  },
})
export default class Test extends Vue {
  groupInfo: Group | null = null;

  memberList: BriefGroupMemberInfo[] = [];
  async created() {
    await this.test();
  }

  async test() {
    const res = await getGroupDetailAPI({
      GroupID: 5923,
    });
    this.groupInfo = res[0].GroupDetail;

    const data = await getMemberListAPI({
      GroupID: 5923,
      RoleTypeList: [0, 1],
    });

    this.memberList = data[0].MemberList;

    console.log('data', this.memberList);
  }
}
</script>

<style>
</style>
