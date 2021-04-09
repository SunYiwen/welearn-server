const { query } = require('../mysql/db');
const distributeRecord = async () => {
  const records = await query('SELECT * FROM record');
  const queueMap = new Map();

  for (let record of records) {
    const { groupID, recordID } = record;
    if (queueMap.has(groupID)) {
      const list = queueMap.get(groupID).list;
      list.push(recordID);
    } else {
      const lists = await query('SELECT * FROM approvedList WHERE groupID = ?', [groupID]);
      let list = [];

      if (lists && lists.length > 0) {
        list = JSON.parse(lists[0].recordIDList);
        list.push(recordID);
        queueMap.set(groupID, {
          op: 'update',
          list,
        });
      } else {
        queueMap.set(groupID, {
          op: 'insert',
          list: [recordID]
        });
      }
    }
  }

  for (let [key, value] of queueMap.entries()) {
    const groupID = key;
    // console.log('key', key, value);
    if (value.op === 'update') {
      await query('UPDATE approvedList set recordIDList = ? WHERE groupID = ?', [JSON.stringify(value.list), groupID]);
    } else {
      await query('INSERT into approvedList set ?', { recordIDList: JSON.stringify(value.list), groupID });
    }
  }

  // 删除record
  await query('DELETE FROM record');
}

module.exports = {
  distributeRecord
}