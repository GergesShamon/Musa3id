/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL).
 * Module: Creating speedy deletion requests
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", 'mediawiki.Title', 'mediawiki.messagePoster']), $.ready).then(function() {
  var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber", "wgIsRedirect", "wgUserLanguage"]);
  var revDelCount = 0;
  var CopVioURL;
  var DeletionReason = '';
  var CheckboxSalt, CheckboxNotify;
  var reasons = {
    G: [
      'صفحة [[مساعدة:تجربة|تجربة]]',
      '[[ويكيبيديا:تخريب|تخريب]] محض',
      'إعادة إنشاء صفحة تم [[ويكيبيديا:سياسة الحذف|حذفها]] بناء على [[ويكيبيديا:نقاش الحذف|نقاش حذف]]',
      'صفحة  أنشأها وحررها مستخدم [[ويكيبيديا:سياسة المنع|ممنوع]] من المشاركة في تحرير ويكيبيديا',
      'أعمال صيانة غير خلافية',
      'صفحة طلب منشئها حذفها',
      'دعاية صريحة أو ترويج إلى أمر ما',
      'صفحة [[ويكيبيديا:لا للهجوم الشخصي|تهجم]] أو ذات [[لفظ ناب|محتوى بذئ]]',
      'خطاب موجه'
      ],
    A: [
      'كلام [[ويكيبيديا:كلام فارغ|لا معنى له]] أو غير مفهوم',
      'نص بلغة غير العربية',
      'صفحة فارغة لا تحوي [[نثر|نصا نثريا]]',
      'مقالة نقلت لمشروع ويكي آخر.',
      'مقالة مخالفة [[ويكيبيديا:ملحوظية (عائلات وأنساب)|لسياسة العائلات والأنساب]]',
      'مقالة لا تستوفي [[ويكيبيديا:ملحوظية (أشخاص)|معايير ملحوظية الأشخاص]]',
      'معلومات متضادة ومتلابسة',
      'خرق واضح [[ويكيبيديا:حقوق التأليف والنشر|لحقوق التأليف والنشر]] نتيجة لنسخ المحتوى من مكان آخر بدون تصريح',
      'مقالة [[ويكيبيديا:ترجمة آلية|مترجمة آلياً]] ذات محتوى ركيك'
      ],
    F: [
      'صورة فاسدة أو صفحة صورة في [[ويكيميديا كومنز]]',
      'الصور غير الحرة والتي يمكن إنتاج بديل حر لها، أو غير مستخدمة.',
      'ملف متوفر نسخة منه على كومنز',
      'ملف سبام',
      'ملف لا حاجة لها في ويكيبيديا'
      ],
    R: [
      '[[خاص:تحويلات مكسورة|تحويلة مكسورة]]',
      'تحويلة مخالفة ',
      'تحويلة غير ضرورية أو غير مطلوبة ',
      'تحويلة لصفحة نقاش',
      ],
    Ta: [
      'صفحة نقاش لصفحة محذوفة',
      'نقاش لا يخص تطوير الموضوع وتحسينه'
      ],
    U: [
      'بناءً على طلب المستخدم.',
      'صفحة مستخدم مخالفة [[ويكيبيديا:صفحات المستخدمين|للمعايير المتبعة]] أو من إنشاء مجهول',
      'صفحة مستخدم تحتوي على معرض من الصور غير الحرة.',
      'صفحة مستخدم تحتوي على معلومات، نقاشات لا علاقة لها بويكيبيديا.'
      ],
    C: [
      '[[خاص:تصنيفات غير مستخدمة|تصنيف غير مستخدم]] أو مكرر أو ليس له فائدة'
      ],
    T: [
      'وحدة أو قالب مكرر أو ليس له [[ويكيبيديا:قوالب|استخدام مفيد]] أو أنشئ من باب الخطأ'
      ],
    P: [
      'بوابة فارغة',
      'بوابة مكررة',
      'بوابة غير مكتملة',
      'بوابة تجربة',
      'بوابة ليس لها مقالة رئيسية'
      ]
  };
  var api = new mw.Api();
  api.get({
    action: 'query',
    list: 'logevents',
    leaction: 'delete/delete',
    letprop: 'delete',
    letitle: mwConfig.wgPageName
  }).done(function(data) {
    if (data.query.logevents) {
      revDelCount = data.query.logevents.length;
    } else {
      revDelCount = 0;
    }
    var csdSendMessageToCreator = localStorage.getItem("csdSendMessageToCreator") == "true";
    // Example: A process dialog that uses an action set with modes.
    // Subclass ProcessDialog.
    function ProcessDialog(config) {
      ProcessDialog.super.call(this, config);
    }
    OO.inheritClass(ProcessDialog, OO.ui.ProcessDialog);
    // Specify a name for .addWindows()
    ProcessDialog.static.name = 'myDialog';
    // Specify a title and an action set that uses modes ('edit' and 'help' mode, in this example).
    ProcessDialog.static.title = 'Musa3id (Beta) - طلب حذف سريع';
    ProcessDialog.static.actions = [{
      action: 'continue',
      modes: 'edit',
      label: 'تنفيذ',
      flags: ['primary', 'progressive']
        }, {
      action: 'help',
      modes: 'edit',
      label: 'مساعدة'
        }, {
      modes: 'edit',
      label: 'إلغاء',
      flags: ['safe', 'close']
        }, {
      action: 'back',
      modes: 'help',
      label: 'الرجوع',
      flags: ['safe', 'back']
        }];
    // Customize the initialize() method to add content and set up event handlers. 
    // This example uses a stack layout with two panels: one displayed for 
    // edit mode and one for help mode.
    ProcessDialog.prototype.initialize = function() {
      ProcessDialog.super.prototype.initialize.apply(this, arguments);

      // NameSpace Deletion Reasons
      var OptionsNameSpaceReasons = [];
      var NameSpaceDeletionReasons;
      if (mwConfig.wgIsRedirect) {
        reasons.R.forEach(function(string) {
          OptionsNameSpaceReasons.push(new OO.ui.RadioOptionWidget({
            data: string,
            selected: false,
            label: string.replace(/\[\[[^\]]*\|([^\]]*)]]/g, '$1')
          }));
        });
        NameSpaceDeletionReasons = new OO.ui.RadioSelectWidget({
          items: OptionsGeneralReasons
        });
      } else if ([0, 2, 6, 10, 14, 100].includes(mwConfig.wgNamespaceNumber)) {
        let Reasons = []
        switch (mwConfig.wgNamespaceNumber) {
          case 0:
            Reasons = reasons.A;
            break;
          case 2:
            Reasons = reasons.U;
            break;
          case 6:
            Reasons = reasons.F;
            break;
          case 10:
            Reasons = reasons.T;
            break;
          case 14:
            Reasons = reasons.C;
            break;
          case 100:
            Reasons = reasons.P;
        }
        Reasons.forEach(function(string) {
          OptionsNameSpaceReasons.push(new OO.ui.RadioOptionWidget({
            data: string,
            selected: false,
            label: string.replace(/\[\[[^\]]*\|([^\]]*)]]/g, '$1')
          }));
        });
        NameSpaceDeletionReasons = new OO.ui.RadioSelectWidget({
          items: OptionsNameSpaceReasons
        });
      } else if (mwConfig.wgNamespaceNumber % 2 === 1) {
        reasons.Ta.forEach(function(string) {
          OptionsNameSpaceReasons.push(new OO.ui.RadioOptionWidget({
            data: string,
            selected: false,
            label: string.replace(/\[\[[^\]]*\|([^\]]*)]]/g, '$1')
          }));
        });
        NameSpaceDeletionReasons = new OO.ui.RadioSelectWidget({
          items: OptionsNameSpaceReasons
        });
      } else {
        NameSpaceDeletionReasons = new OO.ui.FieldsetLayout();
        NameSpaceDeletionReasons.addItems([
           new OO.ui.FieldLayout(new OO.ui.MessageWidget({
            type: 'warning',
            inline: true,
            label: new OO.ui.HtmlSnippet('<strong>لا سبب وجيه لحذف سريع في هذا النطاق.</strong><br><small>فضلا اختر سببا في قائمة الأسباب العامة.</small><br><hr><br>')
          }))
        ]);
      }
      OptionsNameSpaceDeletionReasons = [];

      // General Reasons
      OptionsGeneralReasons = [];
      reasons.G.forEach(function(string) {
        OptionsGeneralReasons.push(new OO.ui.RadioOptionWidget({
          data: string,
          selected: false,
          label: string.replace(/\[\[[^\]]*\|([^\]]*)]]/g, '$1')
        }));
      });
      GeneralReasons = new OO.ui.RadioSelectWidget({
        items: OptionsGeneralReasons
      });

      // More Options
      DeletionOptions = new OO.ui.FieldsetLayout({
        label: 'خيارات أخرى'
      });
      DeletionOptions.addItems([
                new OO.ui.FieldLayout(CheckboxSalt = new OO.ui.CheckboxInputWidget({
          selected: false,
          value: 'recreationProrection'
        }), {
          label: 'إضافة حماية لمنع إعادة إنشاء الصفحة',
          align: 'inline'
        }),
                new OO.ui.FieldLayout(CheckboxNotify = new OO.ui.CheckboxInputWidget({
          selected: csdSendMessageToCreator,
          value: 'informCreator'
        }), {
          label: 'تنبيه منشئ الصفحة',
          align: 'inline'
        })
            ]);
      HeaderBar = new OO.ui.MessageWidget({
        type: 'notice',
        inline: true,
        label: new OO.ui.HtmlSnippet('<strong>اختيار معيار الحذف السريع</strong><br><small>اختر معيار كسبب للحذف السريع لهذه الصفحة.</small>')
      });
      // Choose a reason for deletion
      if (NameSpaceDeletionReasons instanceof OO.ui.RadioSelectWidget) {
        NameSpaceDeletionReasons.on('select', function(items) {
          DeletionReason = items.data;
          GeneralReasons.selectItem(null);
        });
      }
      GeneralReasons.on('select', function(items) {
        DeletionReason = items.data;
        if (NameSpaceDeletionReasons instanceof OO.ui.RadioSelectWidget) {
          NameSpaceDeletionReasons.selectItem(null);
        }
      });
      // Append content to dialog 
      var left_panel = new OO.ui.PanelLayout({
        $content: [NameSpaceDeletionReasons.$element, DeletionOptions.$element],
        classes: ['one'],
        scrollable: false,
      });
      var right_panel = new OO.ui.PanelLayout({
        $content: GeneralReasons.$element,
        classes: ['two'],
        scrollable: false,
      });
      var stack = new OO.ui.StackLayout({
        items: [left_panel, right_panel],
        continuous: true,
        classes: ['Musa3id-csd-modal-container']
      });
      this.panel1 = new OO.ui.PanelLayout({
        padded: true,
        expanded: false
      });
      if (revDelCount >= "1") {
        HeaderBarRevDel = new OO.ui.MessageWidget({
          type: 'warning',
          label: new OO.ui.HtmlSnippet('حذفت هذه الصفحة ' + revDelCount + ' مرة! (<a href="/w/index.php?title=Special:Log&page=' + mwConfig.wgPageName + '&type=delete">السجل</a>)')
        });
        this.panel1.$element.append(HeaderBar.$element, '<hr><br>', HeaderBarRevDel.$element, '<br>', stack.$element);
      } else {
        this.panel1.$element.append(HeaderBar.$element, '<hr><br>', stack.$element);
      }
      this.panel2 = new OO.ui.PanelLayout({
        padded: true,
        expanded: false
      });
      this.panel2.$element.append('<p><strong>Musa3id</strong>، أداة طورت لأتمتة عمليات مختلفة. يمكنكم تقديم جميع ملاحظاتكم، بما في ذلك تقارير عن الأخطاء واقتراحات ميزات أخرى، على صفحة النقاش الخاصة بالأداة.</p><h2>Licensing and attribution</h2><p>Firstly published at,\ https://tr.wikipedia.org/wiki/MediaWiki:Gadget-Adiutor.js Licensed under Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA 3.0) https://creativecommons.org/licenses/by-sa/3.0/ and GNU Free Documentation License (GFDL) http://www.gnu.org/copyleft/fdl.html.</p>');
      this.stackLayout = new OO.ui.StackLayout({
        items: [this.panel1, this.panel2]
      });
      this.$body.append(this.stackLayout.$element);
    };

    // Set up the initial mode of the window ('edit', in this example.)  
    ProcessDialog.prototype.getSetupProcess = function(data) {
      return ProcessDialog.super.prototype.getSetupProcess.call(this, data).next(function() {
        this.actions.setMode('edit');
      }, this);
    };
    // Use the getActionProcess() method to set the modes and displayed item.
    ProcessDialog.prototype.getActionProcess = function(action) {
      if (action === 'help') {
        // Set the mode to help.
        this.actions.setMode('help');
        // Show the help panel.
        this.stackLayout.setItem(this.panel2);
      } else if (action === 'back') {
        // Set the mode to edit.
        this.actions.setMode('edit');
        // Show the edit panel.
        this.stackLayout.setItem(this.panel1);
      } else if (action === 'continue') {
        var dialog = this;
        return new OO.ui.Process(function() {
          if (DeletionReason == '') {
            return new OO.ui.Error('يجب اختيار سبب للحذف');
          }
          return putCSDTemplate(api, DeletionReason, CheckboxNotify.selected, CheckboxSalt.selected).then(function() {
            dialog.close();
            mw.notify('تم وضع طلب الحذف السريع بنجاح... ستتم إعادة تحميل الصفحة خلال ثوان');
            setTimeout(function() {
              location.reload();
            }, 1500);
          });
        });
      }
      return ProcessDialog.super.prototype.getActionProcess.call(this, action);
    };
    // Get dialog height.
    ProcessDialog.prototype.getBodyHeight = function() {
      return 440; //this.panel1.$element.outerHeight(true);
    };
    // Create and append the window manager.
    var windowManager = new OO.ui.WindowManager();
    $(document.body).append(windowManager.$element);
    // Create a new dialog window.
    var processDialog = new ProcessDialog({
      size: 'larger'
    });
    // Add windows to window manager using the addWindows() method.
    windowManager.addWindows([processDialog]);
    // Open the window.
    windowManager.openWindow(processDialog);

    function putCSDTemplate(api, reason, notify, salt) {
      let deferred = $.Deferred();
      let prependtext = `{{شطب|${reason}}}\n${salt ? '{{Salt}}\n' : ''}`;
      try {
        api.postWithToken('csrf', {
          action: 'edit',
          title: mwConfig.wgPageName,
          prependtext: prependtext,
          summary: `طلب حذف سريع لصفحة، السبب: ${reason}`,
          tags: 'Musa3id',
          errorformat: 'html',
          errorlang: mwConfig.wgUserLanguage,
          errorsuselocal: true,
          format: 'json'
        }).then(function() {
          getCreator(api).then(function(data) {
            if (notify) {
              var user = data.query.pages[mw.config.get('wgArticleId')].revisions[0].user;
              var message = `{{تنبيه شطب 2|${mwConfig.wgPageName}|${reason}}}}`;
              sendMessageToAuthor(user, message);
            }
            deferred.resolve();
          }, function(_, error) {
            deferred.reject([new OO.ui.Error(api.getErrorMessage(error))]);
          });
        }, function(_, error) {
          deferred.reject([new OO.ui.Error(api.getErrorMessage(error))]);
        });
      } catch (error) {
        deferred.reject([new OO.ui.Error(api.getErrorMessage(error))]);
      }

      return deferred;
    }

    function getCreator(api) {
      return api.get({
        action: 'query',
        prop: 'revisions',
        rvlimit: 1,
        rvprop: ['user'],
        rvdir: 'newer',
        errorformat: 'html',
        errorlang: mwConfig.wgUserLanguage,
        errorsuselocal: true,
        titles: mwConfig.wgPageName
      });
    }

    function sendMessageToAuthor(Author, message) {
      let title = new mw.Title('User_talk:' + Author);
      let posterPromise = mw.messagePoster.factory.create(title);
      let poster;
      posterPromise.done(function(_poster) {
        poster = _poster.post('طلب حذف سريع لصفحة ' + '[[' + mwConfig.wgPageName.replace(/_/g, " ") + ']]',
          message);
      });
      return poster;
    }
  });
});
/* </nowiki> */
