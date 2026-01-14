var LODOP;
function startLodop(data) {
  CreateDataBill(data);
  LODOP.PREVIEW();
}
function CreateDataBill(data) {
  LODOP = getLodop();
  /* LODOP.SET_PRINT_STYLEA("FontSize",16);
    LODOP.PRINT_INITA(10,10,750,533,"收据打印");*/
  /*LODOP.SET_PRINT_PAGESIZE(0,'24cm','14cm',"收据");*/
  // LODOP.ADD_PRI NT_TEXT(30,650,112,20,"No");
  // LODOP.SET_PRINT_STYLE("FontColor","#800000");
  // LODOP.ADD_PRINT_TEXT(30,680,112,20,data.sn);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(80, 120, 150, 20, "小区名称：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(80, 200, 150, 20, data.vname);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(110, 120, 150, 20, "收费项目");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(140, 120, 150, 70, data.project);
  if (data.tyfw != "" && data.tyfw) {
    LODOP.ADD_PRINT_TEXT(170, 120, 150, 70, data.tyfw);
    LODOP.ADD_PRINT_TEXT(170, 250, 250, 100, data.tyfw_remark);
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
    LODOP.ADD_PRINT_TEXT(
      170,
      540,
      80,
      20,
      formatMoney(data.tyfw_money, 2, "￥")
    );
    LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
  }

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(110, 250, 250, 20, "摘      要：");
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(140, 250, 250, 100, data.zy);
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(110, 540, 80, 20, "金额：");
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(140, 540, 80, 20, formatMoney(data.mainmoney, 2, "￥"));
  LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);

  /*LODOP.SET_PRINT_STYLE("FontColor","#000000");
    LODOP.ADD_PRINT_TEXT(70,540,150,20,"收款时间：");
    LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
    LODOP.ADD_PRINT_TEXT(70,600,150,20,data.nowtime);*/

  /* LODOP.SET_PRINT_STYLE("FontColor","#000000");
    LODOP.ADD_PRINT_TEXT(135,50,150,20,"客户姓名：");
    LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
    LODOP.ADD_PRINT_TEXT(135,110,150,20,data.realname);*/

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(80, 320, 150, 20, "房号/姓名：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(80, 380, 150, 20, data.roomnum);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(80, 500, 150, 20, "日期：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(80, 530, 150, 20, data.dateee);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(250, 130, 300, 20, "合计：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(250, 180, 300, 20, formatMoney(data.money, 2, "￥"));

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(250, 260, 300, 20, "人民币(大写)：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(250, 340, 300, 20, data.Dmoney);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(250, 500, 300, 20, "渠道：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(250, 540, 300, 20, data.way);

  /* LODOP.SET_PRINT_STYLE("FontColor","#000000");
    LODOP.ADD_PRINT_TEXT(225,50,300,20,"收款方式：");
    LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
    LODOP.ADD_PRINT_TEXT(225,110,300,20,data.way);*/

  /*  LODOP.SET_PRINT_STYLE("FontColor","#000000");
    LODOP.ADD_PRINT_TEXT(330,50,300,20,"备注说明：");
    LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
    LODOP.ADD_PRINT_TEXT(330,110,300,20,data.bz);*/

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(290, 120, 150, 20, "收款单位：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(290, 190, 150, 40, data.skdw);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(290, 350, 150, 20, "收款人：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(290, 400, 150, 20, data.creater);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.ADD_PRINT_TEXT(290, 490, 150, 20, "交款人：");
  LODOP.SET_PRINT_STYLE("FontColor", "#0000FF");
  LODOP.ADD_PRINT_TEXT(290, 540, 150, 20, data.realname);

  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.SET_PRINT_STYLE("FontSize", "13");
  LODOP.ADD_PRINT_TEXT(25, 500, 150, 20, "No");
  LODOP.SET_PRINT_STYLEA(0, "PreviewOnly", true);
  LODOP.SET_PRINT_STYLE("FontColor", "#800000");
  LODOP.ADD_PRINT_TEXT(25, 520, 150, 20, data.receipt_num);
  LODOP.SET_PRINT_STYLEA(0, "PreviewOnly", true);
  LODOP.ADD_PRINT_SHAPE(2, 50, 100, 550, 285, 0);
  LODOP.SET_PRINT_STYLEA(0, "PreviewOnly", true);
  LODOP.SET_PRINT_STYLE("FontColor", "#000000");
  LODOP.SET_PRINT_STYLE("FontSize", "20");
  LODOP.SET_PRINT_STYLE("FontWeight", "800");
  LODOP.ADD_PRINT_TEXT(10, 350, 390, 20, "收据");
  LODOP.SET_PRINT_STYLEA(0, "PreviewOnly", true);

  // LODOP.ADD_PRINT_SHAPE(2, 50, 30,700,380,0);
  // LODOP.SET_PRINT_STYLE("FontColor","#000000");
  // LODOP.ADD_PRINT_TEXT(25,400,112,20,"收据");
  // LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
  // LODOP.ADD_PRINT_SHAPE(2,100,95,655,300,0,1,"#800000");
  // LODOP.ADD_PRINT_TEXT(126,150,100,20,"郭德强");
  // LODOP.ADD_PRINT_TEXT(151,150,100,20,"13954885188");
  // LODOP.ADD_PRINT_TEXT(125,584,99,20,"发票打印(第1次)");
  // LODOP.ADD_PRINT_TEXT(465,140,198,20,"陆百柒拾捌元叁角零分");
  // LODOP.ADD_PRINT_TEXT(465,599,70,20,"678.30");
  // LODOP.ADD_PRINT_TEXT(191,58,100,20,"国内漫游通话");
  // LODOP.SET_PRINT_STYLEA(0,"FontSize",7);
  // LODOP.ADD_PRINT_TEXT(191,217,100,20,"584.00");
  // LODOP.ADD_PRINT_TEXT(222,58,100,20,"增值业务费");
  // LODOP.ADD_PRINT_TEXT(222,217,100,20,"48.30");
  // LODOP.ADD_PRINT_TEXT(251,58,100,20,"代收费");
  // LODOP.ADD_PRINT_TEXT(251,217,100,20,"50.00");
  // LODOP.ADD_PRINT_TEXT(280,58,100,20,"优惠费");
  // LODOP.ADD_PRINT_TEXT(280,217,100,20,"4.00");

  // LODOP.ADD_PRINT_TEXT(97,307,150,20,"2008年10月19日 10:28:38");
  // LODOP.ADD_PRINT_TEXT(152,584,103,20,"138860016786");
  // LODOP.ADD_PRINT_TEXT(95,571,112,20,"06775516");
}
function formatMoney(number, places, symbol) {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "￥";
  var negative = number < 0 ? "-" : "",
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + "," : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") +
    (places
      ? "." +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
}

function today(tag, min) {
  var D = new Date();
  var int = D.getDate(),
    y = D.getFullYear(),
    m = D.getMonth() + 1,
    d = D.getDate(),
    h = D.getHours(),
    i = D.getMinutes(),
    s = D.getSeconds();

  switch (min) {
    case "y":
      return y;
    case "m":
      return y + tag + m;
    case "d":
      return y + tag + m + tag + d;
    case "h":
      return y + tag + m + tag + d + " " + h;
    case "i":
      return y + tag + m + tag + d + " " + h + ":" + i;
    case "s":
      return y + tag + m + tag + d + " " + h + ":" + i + ":" + s;
  }
}
