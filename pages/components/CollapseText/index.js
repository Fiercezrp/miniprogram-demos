// pages/components/CollapseText/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 文案
    completeText: {
      type: String,
      value: "",
      observer() {
        this.initCalculateExpand();
      },
    },
    // 文字超过多少行折叠
    maxLineNumber: {
      type: Number,
      value: 3,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 实际行数
    rowNum: 0,
    // 行数是否计算完成
    isCalculateDone: false,
    // 是否需要展开、收起功能
    isNeedExpand: false,
    // 是否展开
    isExpand: false,
    // 展开时显示的简短内容
    shortText: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**初始化展开、收起 */
    initCalculateExpand() {
      this.calculateRow(
        {
          context: this,
          classOrId: ".text_content",
          lineHeightrpx: 40,
        },
        (rowNum) => {
          const { completeText = "", maxLineNumber } = this.properties;
          // console.log("completeText:", completeText);
          // 行数大于指定最多行数时才需要展开收起功能
          console.log("rowNum:", rowNum);
          const isNeedExpand = rowNum > maxLineNumber;
          let shortText = "";
          if (isNeedExpand) {
            const shortTextLength = Math.floor(
              (completeText.length / rowNum) * maxLineNumber
            );
            shortText = `${completeText.substr(0, shortTextLength - 8)} ...`;
            console.log("shortText:", shortText);
          }
          this.setData({
            rowNum,
            isCalculateDone: true,
            isNeedExpand,
            shortText,
          });
        }
      );
    },

    /**初始计算展开、收起状态 */
    calculateRow(
      obj = {
        context,
        classOrId: "",
        lineHeightrpx: 0,
      },
      callback
    ) {
      let rowNum = 0;
      this.getRect(obj.context, obj.classOrId).then((rect) => {
        const height = rect ? rect.height || 0 : 0;
        const height2rpx = this.px2rpx(height);
        console.log("height2rpx:", height2rpx);
        rowNum = Math.round(height2rpx / obj.lineHeightrpx);
        console.log("===rowNum:==", rowNum);
        callback && callback(rowNum);
      });
    },

    /**px转换为rpx */
    px2rpx(px = 0) {
      const pixelRatio = 750 / wx.getSystemInfoSync().windowWidth;
      return px * pixelRatio;
    },

    /**获取节点信息 */
    getRect(context, selector) {
      return new Promise((resolve) => {
        wx.createSelectorQuery()
          .in(context)
          .select(selector)
          .boundingClientRect()
          .exec((rect = []) => {
            console.log(rect[0]);
            return resolve(rect[0]);
          });
      });
    },

    // 展开
    handleExpand() {
      this.setData({
        isExpand: true,
      });
    },
    // 收起
    handleCollapse() {
      this.setData({
        isExpand: false,
      });
    },
  },
});
