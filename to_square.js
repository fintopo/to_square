/*
 * toSquare - Ver.1.0.0 (2015/06/26)
 * by fintopo(http://www.fintopo.jp/)
 * http://fintopo.github.io/to_square/
 */
$(function(){
  var canvas = $('.js_canvas').get(0);
  var context = canvas.getContext('2d');
  context.fillStyle = '#e1e1e1';
  context.fillRect(0, 0, canvas.width, canvas.height);
  //
  var image = new Image();
  // 機能切り替え
  var commands = (function(){
    var getCommand = function(){
      return $('.tab-pane.active').attr('id');
    };
    var clearOutput = function(){
      $('.js_image1').show().attr('src', 'dummy.png');
      $('.js_image2').show().attr('src', 'dummy.png');
    };
    //
    var cs = canvas.width;
    //
    var commands = {};
    commands.expansion = (function(){
      // 長辺に合わせて正方形にする
      var iw, ih;
      //
      return {
        drawFrame: function(){
          iw = image.width;
          ih = image.height;
          // 画像表示
          var x = 0;
          var y = 0;
          var dw, dh;
          if (iw >= ih) {
            dw = cs;
            dh = cs * ih / iw;
            y = (cs - dh) / 2;
          } else {
            dw = cs * iw / ih;
            dh = cs;
            x = (cs - dw) / 2;
          }
          context.fillStyle = 'white';
          context.fillRect(0, 0, cs, cs);
          context.drawImage(image, x, y, dw, dh);
          // フレーム表示
          context.strokeStyle = 'black';
          context.strokeRect(0, 0, cs, cs);
        }
        ,convertImage: function(){
          var os;
          var dx = 0;
          var dy = 0;
          if (iw >= ih) {
            os = iw;
            dy = (os - ih) / 2;
          } else {
            os = ih;
            dx = (os - iw) / 2;
          }
          var image1 = document.createElement("canvas");
          image1.width = os;
          image1.height = os;
          var context1 = image1.getContext('2d');
          context1.fillStyle = 'white';
          context1.fillRect(0, 0, os, os);
          context1.drawImage(image, dx, dy);
          $('.js_image1').show().attr('src', image1.toDataURL());
          $('.js_image2').hide();
        }
      };
    })();
    //
    commands.split = (function(){
      // 長辺で2つに分離する
      var bs = cs / 2;
      //
      var iw, ih;
      var dw, dh;
      //
      return {
        drawFrame: function(){
          iw = image.width;
          ih = image.height;
          // 画像表示
          var x = 0;
          var y = 0;
          if (iw >= ih) {
            dw = cs;
            dh = cs * ih / iw;
            if ((ih / iw) > 0.5) {
              var a = bs / dh;
              dw *= a;
              dh *= a;
              x = (cs - dw) / 2;
            }
            y = (cs - dh) / 2;
          } else {
            dw = cs * iw / ih;
            dh = cs;
            if ((iw / ih) > 0.5) {
              var a = bs / dw;
              dw *= a;
              dh *= a;
              y = (cs - dh) / 2;
            }
            x = (cs - dw) / 2;
          }
          context.fillStyle = 'white';
          context.fillRect(0, 0, cs, cs);
          context.drawImage(image, x, y, dw, dh);
          // フレーム表示
          var bx = 0;
          var bx2 = 0;
          var by = 0;
          var by2 = 0;
          if (iw >= ih) {
            bx2 = cs / 2;
            by = by2 = cs / 4;
          } else {
            bx = bx2 = cs / 4;
            by2 = cs / 2;
          }
          context.strokeStyle = 'black';
          context.strokeRect(bx, by, bs, bs);
          context.strokeRect(bx2, by2, bs, bs);
        }
        ,convertImage: function(){
          var rate;
          var os;
          var ox = 0;
          var oy = 0;
          var ox2 = 0;
          var oy2 = 0;
          if (iw >= ih) {
            rate = ih / iw;
            ox2 = - (iw / 2);
            if ((ih / iw) > 0.5) {
              rate *= bs / dh;
              os = ih;
              ox = os + ox2;
            } else {
              os = iw / 2;
              oy = oy2 = (os - ih) / 2;
            }
          } else {
            rate = iw / ih;
            oy2 = - (ih / 2);
            if ((iw / ih) > 0.5) {
              rate *= bs / dw;
              os = iw;
              oy = os + oy2;
            } else {
              os = ih / 2;
              ox = ox2 = (os - iw) / 2;
            }
          }
          var image1 = document.createElement("canvas");
          image1.width = os;
          image1.height = os;
          var context1 = image1.getContext('2d');
          context1.fillStyle = 'white';
          context1.fillRect(0, 0, os, os);
          context1.drawImage(image, ox, oy);
          $('.js_image1').show().attr('src', image1.toDataURL());
          //
          var image2 = document.createElement("canvas");
          image2.width = os;
          image2.height = os;
          var context2 = image2.getContext('2d');
          context2.fillStyle = 'white';
          context2.fillRect(0, 0, os, os);
          context2.drawImage(image, ox2, oy2);
          $('.js_image2').show().attr('src', image2.toDataURL());
        }
      };
    })();
    //
    return {
      'drawFrame': function(){
        commands[getCommand()].drawFrame();
        clearOutput();
      }
      ,'convertImage': function(){
        commands[getCommand()].convertImage();
      }
    };
  })();
  //
  image.addEventListener('load', commands.drawFrame, false);
  // タブ切り替え
  $('#function_tabs a').click(function (e) {
    $('#function_tabs li').removeClass('active');
    $('.tab-pane').removeClass('active');
    $(this).closest('li').addClass('active');
    var hash = $(this).attr('href');
    $(hash).addClass('active');
    //
    commands.drawFrame();
  });
  // ファイルの読み込み
  $('.jsbtn_load_image').click(function(){
    var files = $('.js_src_image').get(0).files;
    image.src = URL.createObjectURL(files[0]);
  });
  // 画像変換
  $('.jsbtn_convert').click(commands.convertImage);
});