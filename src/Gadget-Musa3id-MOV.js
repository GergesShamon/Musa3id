/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: User Warning
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows"]), $.ready).then(function() {
  // Variables
  var mwConfig = mw.config.get(["wgNamespaceNumber", "wgPageName", "wgUserLanguage"]);
  var api = new mw.Api({
    parameters: {
      errorformat: 'html',
      errorlang: mwConfig.wgUserLanguage,
      errorsuselocal: true,
      tags: 'Musa3id'
    }
  });
  var reasons = [
    "تصويب الاسم: تغيير العنوان إلى عنوان أدق",
    "حسب الطلب في [[ويكيبيديا:طلبات النقل|طلبات النقل]]",
    "حسب توافق سابق",
    "إضافة توضيح لتخصيص العنوان",
    "خطأ إملائي في العنوان: تهجئة كلمة واحدة أو أكثر غير سليمة",
    "خطأ نحوي في العنوان: تركيب الجملة غير سليم",
    "تنكير: إزالة التعريف",
    "إفراد: لا داعٍ لذكر الجمع",
    "توحيد أسلوب صياغة العنوان مع مجموعة أخرى من العناوين",
    "توحيد الاصطلاح مع سائر المقالات ذات الصلة",
    "تعريب العنوان",
    "حسب توافق [[وب:مصادر موثوقة|المصادر الموثوقة]]",
    "اسم عشوائي من غير معنى واضح",
    "استرجاع: نقل خلافي وبغير نقاش"
  ];
  var input = {
    from: mwConfig.wgPageName.replace(/_/g, ' '),
    to: mwConfig.wgPageName.replace(/_/g, ' '),
    reason: '',
    movesubpages: false,
    noredirect: false,
    noredirectTalk: true
  };
  var windowManager = new OO.ui.WindowManager();


  // Functions
  function getTalkPage(input) {
    const namespaces = {
      "مستخدم": "نقاش المستخدم",
      "ويكيبيديا": "نقاش ويكيبيديا",
      "وب": "نقاش ويكيبيديا",
      "ملف": "نقاش الملف",
      "ميدياويكي": "نقاش ميدياويكي",
      "قالب": "نقاش القالب",
      "مساعدة": "نقاش المساعدة",
      "تصنيف": "نقاش التصنيف",
      "بوابة": "نقاش البوابة",
      "كتب": "نقاش الكتب",
      "نص زمنيTimedText": "نقاش النص الزمنيTimedText talk",
      "وحدة": "نقاش الوحدة"
    };
    if (!input.includes(":")) {
      return `نقاش:${input}`;
    }
    let namespace = input.split(":")[0];
    let title = input.split(":")[1];
    if ($.inArray(namespace, namespaces)) {
      return `${namespaces[namespace]}:${title}`;
    } else {
      return false;
    }
  }

  function move(from, to, reason, movesubpages, noredirect, noredirectTalk) {
    const deferred = $.Deferred();
    const commonParameters = {
      action: 'move',
      from,
      to,
      reason
    };

    if (movesubpages) {
      commonParameters.movesubpages = true;
    }

    if (noredirect) {
      commonParameters.noredirect = true;
    }

    const successfully = function() {
      deferred.resolve();
    };

    const rejected = function(_, error) {
      deferred.reject([new OO.ui.Error(api.getErrorMessage(error))]);
    };

    if (noredirectTalk) {
      const talkPageParameters = {
        ...commonParameters,
        from: getTalkPage(from),
        to: getTalkPage(to),
        noredirect: true
      };

      api.postWithToken('csrf', commonParameters).then(function() {
        api.get({
          action: 'query',
          titles: getTalkPage(from)
        }).then(function(data) {
          if (!data.query.pages[-1]) {
            api.postWithToken('csrf', talkPageParameters).then(successfully, rejected);
          } else {
            successfully();
          }
        }, rejected);
      }, rejected);
    } else {
      const moveParameters = {
        ...commonParameters,
        movetalk: true
      };

      api.postWithToken('csrf', moveParameters).then(successfully, rejected);
    }
    return deferred;
  }

  function MoverDialog(config) {
    MoverDialog.super.call(this, config);
  }
  // ProcessDialog
  OO.inheritClass(MoverDialog, OO.ui.ProcessDialog);

  MoverDialog.static.name = 'myProcessDialog';
  MoverDialog.static.title = 'Musa3id (Beta) - الناقل';
  MoverDialog.static.actions = [
    { action: 'save', label: 'نقل', flags: ['primary', 'progressive'] },
    { label: 'إلغاء', flags: 'safe' }
  ];

  MoverDialog.prototype.initialize = function() {
    MoverDialog.super.prototype.initialize.apply(this, arguments);
    this.content = new OO.ui.PanelLayout({ padded: true, expanded: false });
    this.header = new OO.ui.MessageWidget({
      type: "notice",
      inline: true,
      label: new OO.ui.HtmlSnippet("<small>سيؤدي استخدام النموذج أدناه إلى إعادة تسمية صفحة، مع نقل كل تاريخها إلى الاسم الجديد، أنت مسئول عن التأكد من أن الروابط لا تزال تشير إلى المكان الذي من المفترض أن تذهب إليه.<br/>لاحظ أنه لن يتم نقل الصفحة إذا كانت هناك بالفعل صفحة في العنوان الجديد: هذا يعني أنه يمكنك إعادة تسمية صفحة إلى المكان الذي تمت إعادة تسميتها منه إذا ارتكبت خطأً، ولا يمكنك استبدال صفحة موجودة.</small>")
    });
    this.input_to = new OO.ui.TextInputWidget({
      value: input.to
    });
    this.input_reason = new OO.ui.ComboBoxInputWidget({
      options: reasons.map((value, index) => {
        return {
          data: value
        };
      })
    });
    this.input_movesubpages = new OO.ui.CheckboxInputWidget({
      selected: input.movesubpages
    });
    this.input_noredirect = new OO.ui.CheckboxInputWidget({
      selected: input.noredirect
    });
    this.input_noredirectTalk = new OO.ui.CheckboxInputWidget({
      selected: input.noredirectTalk
    });


    this.field_to = new OO.ui.FieldLayout(this.input_to, {
      align: "inline",
      label: 'إلى'
    });
    this.field_reason = new OO.ui.FieldLayout(this.input_reason, {
      align: "inline",
      label: 'سبب'
    });
    this.field_movesubpages = new OO.ui.FieldLayout(this.input_movesubpages, {
      align: "inline",
      label: 'نقل الصفحات الفرعية، إن وُجِدت'
    });
    this.field_noredirect = new OO.ui.FieldLayout(this.input_noredirect, {
      align: "inline",
      label: 'دون ترك تحويلة'
    });
    this.field_noredirectTalk = new OO.ui.FieldLayout(this.input_noredirectTalk, {
      align: "inline",
      label: 'نقل صفحة نقاش بدون ترك تحويلة'
    });

    this.fieldset_options = new OO.ui.FieldsetLayout({
      label: "خيارات"
    });
    this.fieldset = new OO.ui.FieldsetLayout();
    this.fieldset.addItems([this.header, this.field_to, this.field_reason]);
    this.fieldset_options.addItems([this.field_movesubpages, this.field_noredirect, this.field_noredirectTalk]);
    this.content.$element.append(this.fieldset.$element, this.fieldset_options.$element);
    this.$body.append(this.content.$element);

    // Events
    this.input_to.on('change', function(value) {
      input.to = value;
    });
    this.input_reason.on('change', function(value) {
      input.reason = value;
    });
    this.input_movesubpages.on('change', function(value) {
      input.movesubpages = value;
    });
    this.input_noredirect.on('change', function(value) {
      input.noredirect = value;
    });
    this.input_noredirectTalk.on('change', function(value) {
      input.noredirectTalk = value;
    });

    if (mwConfig.wgNamespaceNumber % 2 !== 0) {
      this.input_noredirectTalk.toggle(false);
      input.noredirectTalk = false;
    }
  };
  MoverDialog.prototype.getActionProcess = function(action) {
    var dialog = this;
    if (action) {
      return new OO.ui.Process(function() {
        return move(mwConfig.wgPageName, input.to, input.reason, input.movesubpages, input.noredirect, input.noredirectTalk).then(function() {
          dialog.close();
          mw.notify('نُقلت الصفحة بنجاح... ستتم إعادة تحميل الصفحة خلال ثوان');
          setTimeout(function() {
            location.reload();
          }, 1500);
        });
      });
    }
    return MoverDialog.super.prototype.getActionProcess.call(this, action);
  };
  $(document.body).append(windowManager.$element);

  var dialog = new MoverDialog();
  windowManager.addWindows([dialog]);
  windowManager.openWindow(dialog);
});
/* </nowiki> */