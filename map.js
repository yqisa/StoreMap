// let hospitalData = require('hospitalData')
Page({
  data: {
    centerX: 0.0,
    centerY: 0.0,
    scale: 14,
    shoumaiType: 1,
    area: '',
    url: 'https://xxx/api/',
    markers: [],
    controls: [{
      id: 1,
      iconPath: '',
      position: {
        left: 0,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }],
    cq: 0,
    cz: 0,
    array: ['全部类型'],
    areaName: ['全部地区'],
    date: '2020-01',
    comments: [],
    time: ''
  },
  bindPickerChange: function (e) {
    let that = this;
    console.log(typeof (Number(e.detail.value)))
    switch (Number(e.detail.value)) {
      case 0:
        that.data.shoumaiType = ''
        that.onLoad();
      case 1:
        that.data.shoumaiType = 1
        that.onLoad();
        break;
      case 2:
        that.data.shoumaiType = 2
        that.onLoad();
        break;
      case 3:
        that.data.shoumaiType = 3
        that.onLoad();
        break;
    }
    this.setData(
      {
        index: e.detail.value,
        cq: 1
      }
    )
  }
  ,
  bindDateChange: function (e) {
    console.log(e)
    var str = e.detail.value.split('-')
    this.setData({
      date: str[0] + '-' + str[1]
    })
    this.data.date = str[0] + '-' + str[1]
    this.onLoad();
  },
  bindaddressChange: function (e) {
    let that = this;
    that.data.area = Number(e.detail.value) + 1;
    console.log(that.data.area)
    console.log(typeof (that.data.area))
    that.onLoad();
    // }
    this.setData(
      {
        index1: e.detail.value,
        cz: 1
      }
    )
  }
  ,

  onReady: function (e) {
    let that = this;
    this.setData(
      {
        index: 1,
        cq: 1
      }
    )
    var date = new Date();
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var nowDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (nowDate >= 0 && nowDate <= 9) {
      nowDate = "0" + nowDate;
    }
    var newDate = year + seperator + month
    that.setData({
      date: newDate,
    });
    this.data.date = newDate
    this.mapCtx = wx.createMapContext('myMap')
    // wx.request({
    //   url: that.data.url + 'app/common/getAllAreas',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {
    //     var areaName = []
    //     for (var i in res.data.data) {
    //       areaName.push(res.data.data[i].areaName)
    //     }
    //     console.log(areaName)
    //     that.setData({
    //       areaName: areaName,

    //     })
    //   }
    // })

  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    wx.request({
      url: that.data.url + 'bos/shanghu/shanghuPage?size=' + 2000,
      data: {
        // shoumaiType: that.data.shoumaiType,
        // areaName: that.data.area,
      },
      header: { 'content-type': 'application/json' },
      success(res) {
        var data = res.data.data.content;
        wx.request({
          url: that.data.url + 'bos/shanghu/jianchajiluPage',
          data: {
            monthTime: that.data.date
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            var content = res.data.data.content
            for (var i in data) {
              // data[i].id == shanghuId
              for (var y in content) {
                var z = []
                if (data[i].id == content[y].shanghuId) {
                  if (content[y].checkResult == 1) {
                    z.push(100)
                  }
                  if (content[y].checkResult == 2) {
                    z.push(75)
                  }
                  if (content[y].checkResult == 3) {
                    z.push(50)
                  }
                  if (content[y].checkResult == 4) {
                    z.push(25)
                  }

                }
              }
              var sum = ''
              if (z){
                for (var l = 0; l < z.length; l++) {
                  sum += z[l];
                }
                var ap = sum / z.length
                data[i].avPinjia = ap
              }

            }

            // that.data.comments = res.data.data.content
            // console.log(that.data.comments)
            // that.setData({
            //   comments: that.data.comments,
            // });
            var hospitalData = []
            var maparrey = []
            var callout = []
            // var data = res.data.data.content;
            for (var i in data) {
              var id = data[i].id;
              var longitude = data[i].lng;
              var latitude = data[i].lat;
              var content = data[i].shanghuName;
              var fontSize = '12';
              var padding = 3;
              var color = '#FFF';
              var textAlign = 'center';
              var borderRadius = 3;
              if (data[i].avPinjia < 25) {
                var bgColor = '#fa543e'
              }
              if (data[i].avPinjia < 75 && data[i].avPinjia >= 50) {
                var bgColor = '#00aeff'
              }
              if (data[i].avPinjia <= 100 && data[i].avPinjia >= 75) {
                var bgColor = '#00c2a8'
              }
              if (data[i].avPinjia < 50 && data[i].avPinjia >= 25) {
                var bgColor = '#e9f812'
              }
              if (!data[i].avPinjia || data[i].avPinjia == 0) {
                var bgColor = '#00c2a8'
              }
              callout = { content: data[i].shanghuName, fontSize: '12', padding: 3, color: '#FFF', textAlign: 'center', borderRadius: 3, bgColor: bgColor, display: "ALWAYS" }
              maparrey = { id: data[i].id, longitude: data[i].lng, latitude: data[i].lat, callout: callout };
              hospitalData.push(maparrey);
            }

            console.log(hospitalData)
            wx.getLocation({
              type: 'gcj02',
              success: (res) => {
                // console.log(res)
                // let latitude = res.latitude;
                // let longitude = res.longitude;
                let latitude = '31.14799';
                let longitude = '121.31581';
                that.setData({
                  centerX: longitude,
                  centerY: latitude,
                  markers: that.getHospitalMarkers(hospitalData)
                })
              }
            });
            wx.hideLoading()
          }
        })


      }
    })

  },

  /**
  * 标示点移动触发
  */
  regionchange(e) {


  },

  /**
  * 点击标识点触发
 */
  markertap(e) {
    console.log(e.markerId)
    wx.navigateTo({
      url: "/pages/index/index?houseId=" + e.markerId
    });
  },

  /**
   * control控件点击时间
   */
  controltap(e) {
    console.log(e.controlId)
    this.moveToLocation()

  },


  /**
  * 获取标识
  */
  getHospitalMarkers(hospitalData) {
    let markers = [];
    for (let item of hospitalData) {
      let marker = this.createMarker(item);
      markers.push(marker)
    }
    console.log('t')
    console.log(markers)
    return markers;

  },

  /**
  * 移动到自己位置
  */
  __getLocation: function () {
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();

  },


  /**
  * 还有地图标识，可以在name上面动手
  */
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      // iconPath: "/image/location.png",
      id: point.id || 0,
      name: point.name || '',
      desc: point.desc || '',
      latitude: latitude,
      longitude: longitude,
      callout: point.callout,
      width: 25,
      height: 48

    };
    return marker;

  }
})
