<template>
  <div class="time-line-wrapper">
    <!-- 起止时间选择 -->
    <el-date-picker v-model="time" type="datetimerange" format="yyyy-MM-dd HH时" range-separator="-"
      start-placeholder="开始日期" end-placeholder="结束日期" @change="dateChangeAndClearState" :picker-options="pickerOptions">
    </el-date-picker>

    <div class="time-line">
      <!-- 播放按钮 -->
      <span id="play-button" :class="isPlay ? 'pause' : 'play'" @click="playOrPauseEvent"></span>

      <!-- 播放条 -->
      <div id="play-bar-wrapper">
        <ul id="play-bar" v-show="timeArr.length != 0">
          <li v-for="(time, i) in timeArr1" :key="'time' + i" :id="'time' + i"
            @click="changeTimePickerProgressEvent(i, $event)">
            <span class="scale-value">{{ time }}</span>
            <span class="cirlce-dot"></span>
            <span class="max-scale-value" v-show="i + 2 == timeArr.length">
              {{ timeArr[timeArr.length - 1] }}
            </span>
            <span class="last-dot" v-show="i + 2 == timeArr.length"></span>
          </li>
        </ul>
        <ul v-show="timeArr.length == 0">
          <li v-for="m in 6" :key="'timeline' + m">
            <span class="scale-value"></span>
            <span class="cirlce-dot"></span>
            <span class="last-dot" v-show="m == 6"></span>
          </li>
        </ul>

        <!-- 进度条 -->
        <div id="progress-bar"></div>

        <!-- 游标 -->
        <span id="trangel"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    gmtToTimeStr,
    getDiffYear,
    getDiffMonth,
    getDiffDate,
    getDiffHour,
    diffTime,
  } from "./time";

  export default {
    data() {
      return {
        time: "",
        isPlay: false,
        timeId: -1,
        isOrigin: true,
        isEnd: false,
        timeArr: [],
        timeArr1: [],
        stepType: "",
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      };
    },
    methods: {
      // 时间轴时刻改变
      momentOfTimelineChange(moment) {
        console.log("时刻改变===", moment);
        // this.$emit("time", moment);
      },

      // 改变时间轴进度
      changeTimePickerProgressEvent(index, event) {
        let clickX = event.offsetX + (index % 6) * 100;
        let overLength = this.computeOverWidthOfPlayBar();
        overLength = overLength >= 600 ? 600 : overLength;
        let ratio = clickX / overLength;

        $("#progress-bar").css({
          width: `${(1 - ratio) * overLength}px`
        });
        $("#trangel").css({
          left: `${clickX}px`
        });
      },

      // 计算时间轴可视化长度
      computeOverWidthOfPlayBar() {
        let overLength =
          this.timeArr1.length * 100 - Math.abs($("#play-bar")[0].offsetLeft);

        return overLength;
      },

      // 计算时间轴初始可视化长度
      computeInitialWidthOfPlayBar() {
        let notScroll = this.timeArr1.length < 6;
        let initialWidth = notScroll ? this.timeArr1.length * 100 : 600;

        return initialWidth;
      },

      // 生成播放轴
      createPlayBar() {
        let initialWidth = this.computeInitialWidthOfPlayBar();

        $("#progress-bar").css({
          width: `${initialWidth}px`,
          right: `${600 - initialWidth}px`,
        });

        this.controlTheDisplayOfTimeLineSegments();
      },

      // 控制时间区段的显示与隐藏
      controlTheDisplayOfTimeLineSegments() {
        let playBarEle = document.querySelector("#play-bar");

        let liEles = playBarEle.children;

        for (let i = 0; i < liEles.length; i++) {
          // 获取 playBarEle 的滚动次数
          let scrollCount = Math.abs(playBarEle.offsetLeft) / 600;

          let isShow = i - 6 * scrollCount >= 0 && i - 6 * scrollCount < 6;

          liEles[i].style.visibility = isShow ? "visible" : "hidden";
        }
      },

      // 设置步长
      setStep(timeArr) {
        let intervalHours = diffTime(timeArr[0], timeArr[1], "h");
        let intervalDays = diffTime(timeArr[0], timeArr[1], "d");
        let intervalMonths = diffTime(timeArr[0], timeArr[1], "M");
        let intervalYears = diffTime(timeArr[0], timeArr[1], "y");

        if (intervalHours < 2) {
          console.log("起止时间需间隔2小时以上...");
          this.stepType = "";
        } else if (intervalHours > 2 && intervalHours < 48) {
          // 2小时 - 2天, 以小时为步长
          this.stepType = "hour";
        } else if (intervalDays >= 2 && intervalMonths < 2) {
          // 2天 - 2个月, 以天为步长
          this.stepType = "day";
        } else if (intervalMonths >= 2 && intervalYears < 2) {
          // 2个月 - 2年, 以月为步长
          this.stepType = "month";
        } else if (intervalYears >= 2) {
          // 2年以上, 以年为步长
          this.stepType = "year";
        }
      },

      // 选择日期发生变化
      dateChangeAndClearState(timeArr) {
        !timeArr && this.momentOfTimelineChange("");
        this.removePlayTimer();
        timeArr && this.setStep(timeArr);

        this.timeArr1 = [];
        this.timeArr = [];

        this.isPlay = false;
        this.isEnd = false;
        this.isOrigin = true;

        this.resetTimeline();
      },

      // 选择时间合法性校验
      vertifyTheLegalityOfTime() {
        if (!this.isOrigin) return true;

        if (!this.time) {
          this.$message({
            message: "请先选择要查看的时间",
            type: "warning",
          });
          return false;
        }

        let intervalTime = this.time[1] - this.time[0];

        if (intervalTime < 3600 * 2 * 1000) {
          this.$message({
            message: "起止时间需在两小时以上",
            type: "warning",
          });
          return false;
        }

        let startTime = gmtToTimeStr(this.time[0]);
        let endTime = gmtToTimeStr(this.time[1]);

        switch (this.stepType) {
          case "year":
            this.timeArr = getDiffYear(startTime, endTime);
            break;
          case "month":
            this.timeArr = getDiffMonth(startTime, endTime);
            break;
          case "day":
            this.timeArr = getDiffDate(startTime, endTime);
            break;
          case "hour":
            this.timeArr = getDiffHour(startTime, endTime);
            break;
        }

        this.timeArr1 = this.timeArr.slice(0, this.timeArr.length - 1);

        this.$nextTick(() => this.createPlayBar());

        this.isOrigin = false;

        return true;
      },

      // 播放 / 暂停事件
      playOrPauseEvent() {
        this.isPlay = !this.isPlay;

        if (!this.isPlay) {
          this.removePlayTimer();
          return;
        }

        if (!this.vertifyTheLegalityOfTime()) return;

        if (this.isEnd) {
          let trangleOffset = $("#trangel")[0].offsetLeft;
          let totalOffset = trangleOffset - $("#play-bar")[0].offsetLeft;

          if (Math.floor(totalOffset / 100) == this.timeArr.length - 1) {
            this.resetTimeline();
          }

          this.controlTheDisplayOfTimeLineSegments();

          this.isEnd = false;
        }

        this.timeId = setInterval(() => {
          let trangleOffset = $("#trangel")[0].offsetLeft;
          let totalOffset = trangleOffset - $("#play-bar")[0].offsetLeft;
          
          // 时间轴初始可视化长度
          let initialWidth = this.computeInitialWidthOfPlayBar();

          // 移动至临界点 -- 游标运动到时间轴最右侧
          if (initialWidth - trangleOffset <= 0 && !this.isEnd) {
            this.timelineArriveCriticalPoint();
            return;
          }

          // 每移动一个步长
          if (totalOffset % 100 == 0) {
            let currentIndex = totalOffset / 100;

            // 移动至最后时刻
            if (currentIndex == this.timeArr.length - 1) {
              this.removePlayTimer();

              this.isEnd = true;
              this.isPlay = false;
            }

            this.momentOfTimelineChange(this.timeArr[currentIndex]);
          }

          this.timelineMoveAnimation();
        }, 50);
      },

      // 时间轴移动动画
      timelineMoveAnimation() {
        $("#trangel").css({
          left: `${$("#trangel")[0].offsetLeft + 1}px`,
        });
        $("#progress-bar").css({
          width: `${$("#progress-bar")[0].offsetWidth - 1}px`,
        });
      },

      // 时间轴到达临界点
      timelineArriveCriticalPoint() {
        let overLength = this.computeOverWidthOfPlayBar() - 600;

        if (overLength < 0) return;

        let barWidth = overLength >= 600 ? 600 : overLength;

        $("#play-bar").css({
          left: `${$("#play-bar")[0].offsetLeft - 600}px`,
        });
        $("#trangel").css({
          left: 0
        });
        $("#progress-bar").css({
          width: `${barWidth}px`,
          right: `${600 - barWidth}px`,
        });

        this.controlTheDisplayOfTimeLineSegments();
      },

      // 重置时间轴
      resetTimeline() {
        let initialWidth = this.computeInitialWidthOfPlayBar();

        $("#play-bar").css({
          left: 0
        });
        $("#trangel").css({
          left: 0
        });
        $("#progress-bar").css({
          width: `${initialWidth}px`,
          right: `${600 - initialWidth}px`,
        });
      },

      // 移除动画定时器
      removePlayTimer() {
        this.timeId != -1 && clearInterval(this.timeId);
        this.timeId = -1;
      },
    },
    beforeDestroy() {
      this.removePlayTimer();
    },
  };

</script>

<style scoped>
  .time-line-wrapper {
    width: 1055px;
    height: 90px;
    position: absolute;
    left: 50%;
    top: 120px;
    transform: translateX(-50%);
    border-radius: 10px;
    z-index: 999;
    background: rgba(4, 17, 45, 0.95);
    border: 1px solid #478dfc;
    box-shadow: inset 0 0 6px 2px #478dfc;
  }

  .time-line-wrapper>>>.el-range-editor--small.el-input__inner {
    width: 280px;
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    border: 1px solid #478dfc;
  }

  .time-line-wrapper>>>.el-date-editor .el-range-separator {
    width: 24px;
    padding: 0;
    color: rgb(86, 171, 228);
  }

  .time-line-wrapper>>>.el-icon-date:before {
    color: rgb(86, 171, 228);
  }

  .time-line-wrapper>>>.el-range-editor--small .el-range-input {
    color: #fff;
  }

  .time-line {
    width: 730px;
    height: 90px;
    position: absolute;
    top: 0;
    left: 320px;
    overflow: hidden;
  }

  #play-button {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1000;
    cursor: pointer;
  }

  #play-button.play {
    background: url(./images/play.png) no-repeat center;
  }

  #play-button.pause {
    background: url(./images/pause.png) no-repeat center;
  }

  /* 播放条 */
  #play-bar-wrapper {
    width: 600px;
    height: 40px;
    position: relative;
    white-space: nowrap;
    position: absolute;
    top: 50%;
    left: 70px;
    transform: translateY(-50%);
  }

  ul {
    text-align: left;
    position: relative;
  }

  li {
    width: 100px;
    height: 6px;
    margin-top: 18px;
    background: #0173a6;
    display: inline-block;
    position: relative;
    cursor: pointer;
  }

  /* 刻度线 */
  .cirlce-dot,
  .last-dot {
    height: 14px;
    width: 14px;
    border-radius: 7px;
    background: url(./images/blue_circle.png) center / cover no-repeat;
    position: absolute;
    bottom: -4px;
    z-index: 10;
  }

  .cirlce-dot {
    left: 0;
    transform: translateX(-50%);
  }

  .last-dot {
    right: 0;
    transform: translateX(50%);
  }

  /* 刻度值 */
  .scale-value,
  .max-scale-value {
    font-size: 12px;
    color: #fff;
    position: absolute;
    bottom: 20px;
  }

  .scale-value {
    left: 0;
    transform: translateX(-50%);
  }

  .max-scale-value {
    right: 0;
    transform: translateX(50%);
  }

  #progress-bar {
    height: 6px;
    background: #50e3c2;
    position: absolute;
    right: 0;
    top: 18px;
    pointer-events: none;
  }

  /* 游标 */
  #trangel {
    width: 12px;
    height: 12px;
    position: absolute;
    left: 0;
    bottom: -3px;
    transform: translateX(-50%);
    background: url(./images/trangel.png);
  }

</style>
