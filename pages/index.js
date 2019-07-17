Page({
  data: {
    list: [
      {
        id: 'demo1',
        name: '简单示例',
        open: true,
        pages: [
          
          {
            name: '视频列表示例',
            key: 'multi',
            path: 'multi/index'
          }

        ]
      },
      
    ]
  },
  kindToggle: function (e) {
    let id = e.currentTarget.id, list = this.data.list;
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
});
