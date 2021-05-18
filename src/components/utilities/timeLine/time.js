export function diffTime(startTime, endTime, unit) {
    // 判断当前月天数
    function getDays(mouth, year) {
      let days = 30
      if (mouth === 2) {
        days = year % 4 === 0 ? 29 : 28
      } else if (mouth === 1 || mouth === 3 || mouth === 5 || mouth === 7 || mouth === 8 || mouth === 10 || mouth === 12) {
        // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31
      }
      return days
    }
    const start = new Date(startTime)
    const end = new Date(endTime)
    // 计算时间戳的差
    const diffValue = end - start
    // 获取年
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()
    // 获取月
    const startMouth = start.getMonth() + 1
    const endMouth = end.getMonth() + 1
    // 获取日
    const startDay = start.getDate()
    const endDay = end.getDate()
    // 获取小时
    const startHours = start.getHours()
    const endHours = end.getHours()
    // 获取分
    const startMinutes = start.getMinutes()
    const endMinutes = end.getMinutes()
    // 获取秒
    const startSeconds = start.getSeconds()
    const endSeconds = end.getSeconds()
    // 下方注释两行为调试用
    // console.log('start:', startYear, startMouth, startDay, startHours, startMinutes, startSeconds)
    // console.log('end:', endYear, endMouth, endDay, endHours, endMinutes, endSeconds)
    if (unit === 'y' || unit === 'M') {
      // 相差年份月份
      const diffYear = endYear - startYear
      // 获取当前月天数
      const startDays = getDays(startMouth, startYear)
      const endDays = getDays(endMouth, endYear)
      const diffStartMouth = (startDays - (startDay + ((startHours * 60 + startMinutes + startSeconds / 60) / 60 / 24) - 1)) / startDays
      const diffEndMouth = (endDay + ((endHours * 60 + endMinutes + endSeconds / 60) / 60 / 24) - 1) / endDays
      const diffMouth = diffStartMouth + diffEndMouth + (12 - startMouth - 1) + endMouth + (diffYear - 1) * 12
      if (unit === 'y') {
        return Math.floor(diffMouth / 12 * 100) / 100
      } else {
        return diffMouth
      }
    } else if (unit === 'd') {
      const d = parseInt(diffValue / 1000 / 60 / 60 / 24)
      return d
    } else if (unit === 'h') {
      const h = parseInt(diffValue / 1000 / 60 / 60)
      return h
    } else if (unit === 'm') {
      const m = parseInt(diffValue / 1000 / 60)
      return m
    } else if (unit === 's') {
      const s = parseInt(diffValue / 1000)
      return s
    } else {
      console.log('请输入正确的单位')
    }
  }
  
  //  获取两个时间之间的所有小时
  export function getDiffHour(start, end) {
    let startStamp = new Date(start).getTime();
    let endStamp = new Date(end).getTime();
  
    let result = [`${start.substring(0, 13)}时`];
  
    while (startStamp + 3600 * 1000 < endStamp) {
      startStamp += 3600 * 1000;
  
      let time = gmtToTimeStr(startStamp).substring(0, 13);
      result.push(`${time}时`);
    }

    if (result[result.length - 1] != `${end.substring(0, 13)}时`) {
      result.push(`${end.substring(0, 13)}时`);
    }

  
    return result;
  }
  
  // 获取两个日期间的所有日期
  export function getDiffDate(startTime, endTime) {
    // 初始化日期列表，数组
    let diffdate = new Array();
    let i = 0;
  
    // 开始日期小于等于结束日期,并循环
    while (startTime <= endTime) {
      let year = startTime.slice(0, 4);
      let month = startTime.slice(5, 7);
      let day = startTime.slice(8, 10);
  
      let current_month = parseInt(month) < 10 ? `0${parseInt(month)}` : parseInt(month);
      let current_day = parseInt(day) < 10 ? `0${parseInt(day)}` : parseInt(day);
  
      diffdate[i] = `${year}-${current_month}-${current_day}`;
  
      // 获取开始日期时间戳
      let stime_ts = new Date(startTime).getTime();
  
      // 增加一天时间戳后的日期
      let next_date = stime_ts + 24 * 60 * 60 * 1000;
  
      // 拼接年月日，这里的月份会返回（0-11），所以要+1
      let next_dates_y = new Date(next_date).getFullYear() + "-";
      let next_dates_m =
        new Date(next_date).getMonth() + 1 < 10 ?
        "0" + (new Date(next_date).getMonth() + 1) + "-" :
        new Date(next_date).getMonth() + 1 + "-";
      let next_dates_d =
        new Date(next_date).getDate() < 10 ?
        "0" + new Date(next_date).getDate() :
        new Date(next_date).getDate();
  
      startTime = next_dates_y + next_dates_m + next_dates_d;
      // 增加数组key
      i++;
    }
  
    return diffdate;
  }
  
  // 获取两个日期中所有的月份
  export function getDiffMonth(start, end) {
    let result = [];
    let s = start.split("-");
    let e = end.split("-");
    let min = new Date();
    let max = new Date();
  
    min.setFullYear(s[0], s[1]);
    max.setFullYear(e[0], e[1]);
  
    let curr = min;
    while (curr <= max) {
      let month = curr.getMonth();
      // let day = curr.getDate();
  
      let current_month = month < 10 ? `0${month}` : month;
      // let current_day = day < 10 ? `0${day}` : day;
  
      let str = curr.getFullYear() + "-" + current_month;
      //+ "-" + current_day;
      let s = curr.getFullYear() + "-00";
  
      if (str == s) {
        str = curr.getFullYear() - 1 + "-12";
      }
  
      result.push(str);
      curr.setMonth(month + 1);
    }
    return result;
  }
  
  // 获取两个日期中的所有年份
  export function getDiffYear(start, end) {
    let startYear = parseInt(start.slice(0, 4));
    let endYear = parseInt(end.slice(0, 4));
  
    let result = [];
  
    for (let i = 0; i <= (endYear - startYear); i++) {
      result.push(startYear + i);
    }
  
    return result;
  }
  
  // 将时间戳转化为时间字符串
  export function timeStampToTimeString(timeStamp) {
    const Y = timeStamp.getFullYear()
    const M = (timeStamp.getMonth() + 1).toString().padStart(2, '0')
    const D = timeStamp.getDate().toString().padStart(2, '0')
    const h = timeStamp.getHours().toString().padStart(2, '0')
    const m = timeStamp.getMinutes().toString().padStart(2, '0')
    const s = timeStamp.getSeconds().toString().padStart(2, '0')
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
  
  export function gmtToTimeStr(time) {
    let date = new Date(time)
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  
    return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
  
  // 将秒转化成“10：20：30”形式
  export function secondsToHMS_string(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
  
    h = h > 9 ? h : ('0' + h);
    m = m > 9 ? m : ('0' + m);
    s = s > 9 ? s : ('0' + s);
  
    return `${h}:${m}:${s}`
  }
  