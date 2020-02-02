<template>
  <div>
    <div class="modal" :class="{'is-active':userNamePanelFlag}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="columns is-gapless is-mobile is-multiline">
            <div class="column is-5">
              <svg id="identicon" width="128" height="128" :data-jdenticon-value="userName" />
            </div>
            <div class="column" id="inputCol">
              <div class="container is-pulled-right is-half">
                <input
                  class="input"
                  type="text"
                  v-model="userName"
                  @input="inputFunc"
                  placeholder="输入你的ID"
                  @keyup.enter="determineModal"
                />

                <button class="button is-success is-half" @click="determineModal">确定</button>
                <button class="button is-half" @click="closeModal">取消</button>
                <p id="IDhex">✨每个ID会由其哈希值生成全宇宙唯一的头像</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <nav class="panel is-shadowless is-primary">
      <p class="panel-heading has-text-centered">DCP-碎片收容装置 v1.0</p>
      <div class="panel-block is-block has-text-centered">
        <p id="foritissoon">For it is soon cut off and we fly away.</p>

        <img src="http://pic.drafff.art//drafff/20200128020242.gif" />
      </div>

      <div class="panel-block">
        <p class="control">
          <input class="input" @keyup.enter="submit" type="text" placeholder="说点什么吧~" v-model="msg" />
        </p>
      </div>
      <div class="panel-block">
        <button class="button is-primary is-outlined is-fullwidth" @click="submit">发射</button>
      </div>
      <div class="panel-block is-inline is-mobile is-c" id="main-content">
        <div class="box" v-for="(item,$index) in list" :key="$index">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <svg width="64" height="64" :data-jdenticon-value="item.user" />
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{item.user}}</strong>
                  <small id="timeDisp">{{item.time|dateFormat}}</small>
                  <br />
                  {{item.content}}
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fa fa-reply"></i>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fa fa-retweet"></i>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <i class="fa fa-heart"></i>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>

        <infinite-loading @infinite="infiniteHandler">
          <div slot="no-more">
            <div id="dzjd" class="panel-block is-inline is-fullwidth">
              <div class="container is-fullwidth">
                <div class="has-text-centered">
                  <small>堆栈见底&lt;/&gt;</small>
                </div>
              </div>
            </div>
          </div>
          <div slot="no-results">出错了，没拿到数据😭</div>
        </infinite-loading>
      </div>
    </nav>
  </div>
</template>

<script>
import scrollReveal from "scrollreveal";
import jdenticon from "jdenticon";

var AV = require("leancloud-storage");

AV.init({
  appId: "egxNwvR84obSXXwtQBsWeCch-MdYXbMMI",
  appKey: "pUwOuqFOgLBjdsrKUn1aqeDL",
  serverURLs: "https://api.drafff.art"
});

window.jdenticon_config = {
  hues: [171],
  lightness: {
    color: [0.4, 0.8],
    grayscale: [0.3, 0.9]
  },
  saturation: {
    color: 0.5,
    grayscale: 0.2
  },
  backColor: "#fff",
  padding: 0.08,
  replaceMode: "observe"
};

export default {
  data() {
    return {
      scrollReveal: scrollReveal(),

      limit: 10,
      total: 0,
      dcp: new AV.Object("dcp"),
      query: new AV.Query("dcp"),
      userNamePanelFlag: false,
      userName: "",
      msg: "",
      list: [
        {
          user: "mobody",
          content: "什么都没有",
          time: new Date()
        },
        {
          user: "mobody",
          content: "什么都没有",
          time: new Date()
        },
        {
          user: "mobody",
          content: "什么都没有",
          time: new Date()
        },
        {
          user: "mobody",
          content: "什么都没有",
          time: new Date()
        }
      ]
    };
  },
  methods: {
    infiniteHandler($state) {
      console.log("sd");
      this.query.descending("createdAt");
      this.query.limit(this.limit);
      this.query.skip(this.total);
      this.query.find().then(data => {
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.list.push(data[i]._serverData);
          }
          this.total += this.limit;

          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },

    determineModal() {
      if (this.userName == "") {
        alert("一定要有个ID");
        return;
      }
      this.userNamePanelFlag = false;
    },
    inputFunc() {
      jdenticon.update("#identicon", this.userName);
    },
    closeModal() {
      this.userNamePanelFlag = false;
      this.userName = "";
    },
    submit() {
      if (this.userName === "") {
        this.userNamePanelFlag = true;
        return;
      }
      if (this.msg === "") {
        alert("有了内容才可以发射");
        return;
      }

      this.dcp.set("user", this.userName);
      this.dcp.set("time", new Date());
      this.dcp.set("content", this.msg);

      // 将对象保存到云端
      this.dcp.save().then(
        function(dcp) {
          // 成功保存之后，执行其他逻辑
          console.log("保存成功。objectId：" + dcp.id);
        },
        function(error) {
          // 异常处理
          console.log(error);
        }
      );

      this.list.unshift({
        time: Date.now(),
        user: this.userName,
        content: this.msg
      });
      this.msg = "";
    }
  },
  created() {
    this.list = [];
    // this.query.descending("createdAt");
    // this.query.limit(this.limit);
    // this.query.skip(this.total);
    // this.query.find().then(data => {
    //   for (let i = 0; i < data.length; i++) {
    //     this.list.push(data[i]._serverData);
    //   }
    //   this.total += this.limit;
    //   // for (item of data) {
    //   //   this.list.push(item._serverData);
    //   //   console.log("111")
    //   // }
    // });
  },
  updated() {
    jdenticon();
    this.scrollReveal.reveal(".box", {
      // 动画的时长
      duration: 600,
      // 延迟时间
      delay: 300,
      // 动画开始的位置，'bottom', 'left', 'top', 'right'
      origin: "bottom",
      // 回滚的时候是否再次触发动画
      reset: false,
      // 在移动端是否使用动画
      mobile: true,
      // 滚动的距离，单位可以用%，rem等
      distance: "200px",
      // 其他可用的动画效果
      opacity: 0.001,
      easing: "ease",
      scale: 0.9
    });
  },
  mounted() {
    jdenticon();
    this.scrollReveal.reveal(".box", {
      // 动画的时长
      duration: 600,
      // 延迟时间
      delay: 300,
      // 动画开始的位置，'bottom', 'left', 'top', 'right'
      origin: "bottom",
      // 回滚的时候是否再次触发动画
      reset: false,
      // 在移动端是否使用动画
      mobile: true,
      // 滚动的距离，单位可以用%，rem等
      distance: "200px",
      // 其他可用的动画效果
      opacity: 0.001,
      easing: "ease",
      scale: 0.9,
      useDelay: "onload"
    });
  },
  components: {}
};
</script>

<style>
</style>