/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL).
 * Module: Creating speedy deletion requests
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", 'mediawiki.Title', 'mediawiki.messagePoster' ]), $.ready).then(function() {
    var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
    var revDelCount = 0;
    var CopVioURL;
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
            switch (mwConfig.wgNamespaceNumber) {
                case 0:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'مقالة'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A1',
                            data: '[[وب:شطب#A1|A1]]: مقالة قصيرة جدا لا تحتوي على السياق الكافي لمعرفة موضوع المقالة',
                            selected: false
                        }), {
                            label: 'A1 - مقالة قصيرة جدا لا تحتوي على السياق الكافي لمعرفة موضوع المقالة.',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A2',
                            data: '[[وب:شطب#A2|A2]]: مقالة بلغة أجنبية موجودة على مشروع ويكيبيديا آخر',
                            selected: false
                        }), {
                            label: 'A2 -  مقالة بلغة أجنبية موجودة على مشروع ويكيبيديا آخر',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A3',
                            data: '[[وب:شطب#A3]]: صفحة بلا محتوى',
                            selected: false
                        }), {
                            label: 'A3 - صفحة بلا محتوى',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A4',
                            data: '[[وب:شطب#A5]]: مقالة نقلت لمشروع ويكي آخر',
                            selected: false
                        }), {
                            label: 'A4 - مقالة نقلت لمشروع ويكي آخر',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A7',
                            data: '[[وب:شطب#A7]]: لا ملحوظية (أشخاص, حيوانات, منظمات, مواقع وب, أحداث)',
                            selected: false
                        }), {
                            label: 'A7 - لا ملحوظية (أشخاص, حيوانات, منظمات, مواقع وب, أحداث)',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A9',
                            data: '[[وب:شطب#A9]]: لا ملحوظية (تسجيلات موسيقية)',
                            selected: false
                        }), {
                            label: 'A9 - لا ملحوظية (تسجيلات موسيقية)',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A10',
                            data: '[[وب:شطب#A10]]: مقالة حديثة تكرر محتوى أو موضوع مقالة موجودة',
                            selected: false
                        }), {
                            label: 'A10 - مقالة حديثة تكرر محتوى أو موضوع مقالة موجودة',
                            align: 'inline',
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'A11',
                            data: '[[وب:شطب#A11]]: الترجمة الآلية الركيكة.',
                            selected: false
                        }), {
                            label: 'A11 - الترجمة الآلية الركيكة.',
                            align: 'inline'
                        }),
                    ]);
                    break;
                case 6:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'الملفات'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F1',
                            data: '[[وب:شطب#F1|F1]]: ملف مكرر',
                            selected: false
                        }), {
                            label: 'F1 - ملف مكرر',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F2',
                            data: '[[وب:شطب#F2|F2]]: ملف فاسد أو فارغ.',
                            selected: false
                        }), {
                            label: 'F2 - ملف فاسد أو فارغ',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F3',
                            data: '[[وب:شطب#F3|F3]]: رخصة غير مقبولة',
                            selected: false
                        }), {
                            label: 'F3 - رخصة غير مقبولة',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F4',
                            data: '[[وب:شطب#F4|F4]]: لا معلومات حول رخصةالملف',
                            selected: false
                        }), {
                            label: 'F4 - لا معلومات حول رخصة الملف',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F5',
                            data: '[[وب:شطب#F5|F5]]: صورة أو ملف غير حر غير مستخدم في مجال المقالات',
                            selected: false
                        }), {
                            label: 'F5 - صورة أو ملف غير حر غير مستخدم في مجال المقالات',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F6',
                            data: '[[وب:شطب#F6|F6]]: ملف مخالف للاستعمال العادل',
                            selected: false
                        }), {
                            label: 'F6 - ملف مخالف للاستعمال العادل',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F7',
                            data: '[[وب:شطب#F7|F7]]: ملف غير مجاني من مصدر تجاري',
                            selected: false
                        }), {
                            label: 'F7 - ملف غير مجاني من مصدر تجاري',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F8',
                            data: '[[وب:شطب#F8|F8]]: ملف موجود بنفس الصيغة ونفس الدقة أو أحسن منها على كومنز',
                            selected: false
                        }), {
                            label: 'F8 - ملف موجود بنفس الصيغة ونفس الدقة أو أحسن منها على كومنز',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F9',
                            data: '[[وب:شطب#F9|File 9]]: تعد صريح على حقوق المؤلف.',
                            selected: false
                        }), {
                            label: 'F9 - تعد صريح على حقوق المؤلف',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F10',
                            data: '[[وب:شطب#F10|F10]]: ملف ليس بصورة أو صوت أو مرئي، غير مستخدم',
                            selected: false
                        }), {
                            label: 'F10 -  ملف ليس بصورة أو صوت أو مرئي، غير مستخدم',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'F11',
                            data: '[[وب:شطب#F11|F11]]: لا دليل على صحة ترخيص الملف',
                            selected: false
                        }), {
                            label: 'F11 -  لا دليل على صحة ترخيص الملف',
                            align: 'inline'
                        }),
                    ]);
                    break;
                case 14:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'التصنيفات'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'C1',
                            data: '[[وب:شطب#C1|C1]]: تصنيف فارغ',
                            selected: false
                        }), {
                            label: 'C1 - تصنيف فارغ',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'C2',
                            data: '[[وب:شطب#C2|C2]]: تغيير سريع للاسم',
                            selected: false
                        }), {
                            label: 'C2 - تغيير سريع للاسم',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'G8',
                            data: '[[وب:شطب#G8|G8]]: صفحات تعتمد على صفحة غير موجودة أو محذوفة',
                            selected: false
                        }), {
                            label: 'G8 - صفحات تعتمد على صفحة غير موجودة أو محذوفة، مثل صفحات النقاش .',
                            align: 'inline'
                        }),
                    ]);
                    break;
                case 2:
                case 3:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'صفحات المستخدم'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'U1',
                            data: '[[وب:شطب#U1|U1]]: بناءً على طلب المستخدم',
                            selected: false
                        }), {
                            label: 'U1 - بناءً على طلب المستخدم',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'U2',
                            data: '[[وب:شطب#U2|U2]]: صفحات نقاش المستخدم وصفحات في نطاق المستخدم لمستخدم غير مسجل',
                            selected: false
                        }), {
                            label: 'U2 - صفحات في نطاق المستخدم لمستخدم غير مسجل',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'U3',
                            data: '[[وب:شطب#U3|U3]]: صفحة مستخدم تحتوي على معرض من الصور غير الحرة.',
                            selected: false
                        }), {
                            label: 'U3 - صفحة مستخدم تحتوي على معرض من الصور غير الحرة.',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'U5',
                            data: '[[وب:شطب#U5|U5]]: صفحة مستخدم مخالفة للمعايير المتبعة',
                            selected: false
                        }), {
                            label: 'U5 - صفحة مستخدم مخالفة للمعايير المتبعة',
                            align: 'inline'
                        }),
                    ]);
                    break;
                case 10:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'القوالب'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'T1',
                            data: '[[وب:شطب#T1|T1]]: Divisive and inflammatory templates',
                            selected: false
                        }), {
                            label: 'T1 - BDivisive and inflammatory templates',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'T2',
                            data: '[[وب:شطب#T2|T2]]: يمثل تحريفًا صارخًا للسياسة المعمول بها.',
                            selected: false
                        }), {
                            label: 'T2 - يمثل تحريفًا صارخًا للسياسة المعمول بها.',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'T3',
                            data: '[[وب:شطب#T3|T3]]: قالب مكرر وشديد التعقيد',
                            selected: false
                        }), {
                            label: 'T3 - قالب مكرر وشديد التعقيد',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'T4',
                            data: '[[وب:شطب#T4|T4]]: صفحة فرعية لصفحة غير موجودة',
                            selected: false
                        }), {
                            label: 'T4 - صفحة فرعية لصفحة غير موجودة',
                            align: 'inline'
                        }),
                    ]);
                    break;
                case 100:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({
                        label: 'البوابات'
                    });
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'P1',
                            data: '[[وب:شطب#P1]]: صفحة بوابة ليس لها موضوع رئيسي ورشحت للحذف السريع',
                            selected: false
                        }), {
                            label: 'P1 - صفحة بوابة ليس لها موضوع رئيسي ورشحت للحذف السريع',
                            align: 'inline'
                        }),
                        new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                            value: 'P2',
                            data: '[[وب:شطب#P2]]: بوابة فارغة أو شبه فارغة',
                            selected: false
                        }), {
                            label: 'P2 - بوابة فارغة أو شبه فارغة',
                            align: 'inline'
                        }),
                    ]);
                    break;
                default:
                    NameSpaceDeletionReasons = new OO.ui.FieldsetLayout({});
                    NameSpaceDeletionReasons.addItems([
                        new OO.ui.FieldLayout(new OO.ui.MessageWidget({
                            type: 'warning',
                            inline: true,
                            label: new OO.ui.HtmlSnippet('<strong>لا سبب وجيه لحذف سريع في هذا النطاق.</strong><br><small>فضلا اختر سببا في قائمة الأسباب العامة.</small><br><hr><br>')
                        })),
                    ]);
                    break;
            }
            GeneralReasons = new OO.ui.FieldsetLayout({
                label: 'الأسباب العامة'
            });
            GeneralReasons.addItems([
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G1',
                    data: '[[وب:شطب#G1|G1]]: محتوى غير مفهوم وبلا معنى وغير متماسك',
                    selected: false
                }), {
                    label: 'G1 - محتوى غير مفهوم وبلا معنى',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G2',
                    data: '[[وب:شطب#G2|G2]]: صفحة تجربة',
                    selected: false
                }), {
                    label: 'G2 - صفحة تجربة',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G3',
                    data: '[[وب:شطب#G3|G3]]: تخريب محض',
                    selected: false
                }), {
                    label: 'G3 - تخريب محض',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G3',
                    data: '[[وب:شطب#G3|G3]]: معلومات الغرض منها الخداع والتدليس',
                    selected: false
                }), {
                    label: 'G3 - معلومات الغرض منها الخداع والتدليس',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G4',
                    data: '[[وب:شطب#G4|G4]]: إعادة إنشاء صفحة حُذفت من قبل بناءا على نقاش',
                    selected: false
                }), {
                    label: 'G4 - إعادة إنشاء صفحة حُذفت من قبل بناءا على نقاش',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G5',
                    data: '[[وب:شطب#G5|G5]]: انشأها مستخدم ممنوع',
                    selected: false
                }), {
                    label: 'G5 - انشأها مستخدم ممنوع',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G6',
                    data: '[[وب:شطب#G6|G6]]: أعمال صيانة غير خلافية.',
                    selected: false
                }), {
                    label: 'G6 - أعمال صيانة',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G7',
                    data: '[[وب:شطب#G7|G7]]: صفحة طلب منشئها حذفها أو قام بإفراغها',
                    selected: false
                }), {
                    label: 'G7 - صفحة طلب منشئها حذفها أو قام بإفراغها',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G8',
                    data: '[[وب:شطب#G8|G8]]: صفحة تعتمد على صفحة غير موجودة أو محذوفة',
                    selected: false
                }), {
                    label: 'G8 - صفحة تعتمد على صفحة غير موجودة أو محذوفة',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'attack',
                    data: 'الصفحات التي هدفها فقط مهاجمة موضوع الصفحة أو تهديده أو ما شابه ذلك .',
                    selected: false
                }), {
                    label: 'G10 - صفحة تهجم',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'negublp',
                    data: '[[وب:شطب#G10|G10]]: محتوى سلبي وغير مزود بمراجع',
                    selected: false
                }), {
                    label: 'G10 - محتوى سلبي وغير مزود بمراجع',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G11',
                    data: '[[وب:شطب#G11|G11]]: إعلانات صريحة',
                    selected: false
                }), {
                    label: 'G11 - إعلانات صريحة',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G12',
                    data: '[[وب:شطب#G12|G12]]: خرق صارخ لحقوق النشر',
                    selected: false
                }), {
                    label: 'G12 - خرق صارخ لحقوق النشر',
                    align: 'inline',
                }),
                copyVioField = new OO.ui.FieldLayout(copyVioInput = new OO.ui.TextInputWidget({
                    placeholder: 'Violated URL',
                    value: '',
                    data: 'COV',
                    classes: ['Musa3id-copvio-input'],
                }), {
                    label: 'URL',
                    align: 'inline',
                    classes: ['Musa3id-copvio-container'],
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G13',
                    data: '[[وب:شطب#G13|G13]]: مسودة مهملة',
                    selected: false
                }), {
                    label: 'G13 - مسودة مهملة',
                    align: 'inline',
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    value: 'G14',
                    data: '[[وب:شطب#G14|G14]]: صفحة توضيح غير ضرورية',
                    selected: false
                }), {
                    label: 'G14 - صفحة توضيح غير ضرورية',
                    align: 'inline',
                }),
            ]);
            copyVioField.$element.hide();
            copyVioInput.$element.hide();
            isCopyVio = false;
            GeneralReasons.$element.on('click', function(item) {
                if (item.target.value === 'G12') {
                    copyVioField.$element.show();
                    copyVioInput.$element.show();
                }
            });
            //copyVioInput.on('change', function() {
            //    console.log(copyVioInput.value);
            //});
            DeletionOptions = new OO.ui.FieldsetLayout({
                label: 'خيارات أخرى'
            });
            DeletionOptions.addItems([
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
                    selected: false,
                    value: 'recreationProrection'
                }), {
                    label: 'إضافة حماية لمنع إعادة إنشاء الصفحة',
                    align: 'inline'
                }),
                new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
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
                label: new OO.ui.HtmlSnippet('<strong>اختيار معيار الحذف السريع</strong><br><small>اختر معيار أو أكثر كسبب للحذف السريع لهذه الصفحة.</small>')
            });
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
                    var CSDReason;
                    var CSDSummary;
                    var CSDReasons = [];
                    var CSDOptions = [];
                    NameSpaceDeletionReasons.items.forEach(function(Reason) {
                        if (Reason.fieldWidget.selected) {
                            CSDReasons.push({
                                value: Reason.fieldWidget.value,
                                data: Reason.fieldWidget.data,
                                selected: Reason.fieldWidget.selected
                            });
                        }
                    });
                    GeneralReasons.items.forEach(function(Reason) {
                        if (Reason.fieldWidget.selected) {
                            CSDReasons.push({
                                value: Reason.fieldWidget.value,
                                data: Reason.fieldWidget.data,
                                selected: Reason.fieldWidget.selected
                            });
                        }
                    });
                    var SaltCSDSummary = '';
                    if (copyVioInput.value != "") {
                        CopVioURL = '|url=' + copyVioInput.value;
                    } else {
                        CopVioURL = "";
                    }
                    if (CSDReasons.length > 1) {
                        var SaltCSDReason = '{{شطب|';
                        var i = 0;
                        var keys = Object.keys(CSDReasons);
                        for (i = 0; i < keys.length; i++) {
                            if (i > 0) SaltCSDReason += (i < keys.length - 1) ? ', ' : ' و ';
                            SaltCSDReason += '[[وب:شطب#' + CSDReasons[keys[i]].value + ']]';
                        }
                        for (i = 0; i < keys.length; i++) {
                            if (i > 0) SaltCSDSummary += (i < keys.length - 1) ? ', ' : ' و ';
                            SaltCSDSummary += '[[وب:شطب#' + CSDReasons[keys[i]].value + ']]';
                        }
                        CSDReason = SaltCSDReason + CopVioURL + '}}';
                        CSDSummary =  SaltCSDSummary ;
                    } else {
                        CSDReason = '{{Db-' + CSDReasons[0].value.toLowerCase() + '}}';
                        CSDSummary = 'طلب حذف سريع لصفحة، السبب: ' + CSDReasons[0].data + '.';
                        SaltCSDSummary = CSDReasons[0].data;
                    }
                    //Invoke the adding template function
                    DeletionOptions.items.forEach(function(Option) {
                        if (Option.fieldWidget.selected) {
                            CSDOptions.push({
                                value: Option.fieldWidget.value,
                                selected: Option.fieldWidget.selected
                            });
                        }
                    });
                    CSDOptions.forEach(function(Option) {
                        if (Option.value === "recreationProrection") {
                            CSDReason = CSDReason + "\n" + '{{Salt}}';
                        }
                        if (Option.value === "informCreator") {
                            getCreator().then(function(data) {
                                var Author = data.query.pages[mw.config.get('wgArticleId')].revisions[0].user;
                                if (!mw.util.isIPAddress(Author)) {
                                    var message = '{{subst:db-reason-notice|' + mwConfig.wgPageName.replace(/_/g, " ") + '|' + SaltCSDSummary + '}}';
                                    sendMessageToAuthor(Author, message);
                                }
                            });
                        }
                    });
                    putCSDTemplate(CSDReason, CSDSummary);
                    showProgress();
                    dialog.close();
                });
            }
            return ProcessDialog.super.prototype.getActionProcess.call(this, action);
        };
        // Get dialog height.
        ProcessDialog.prototype.getBodyHeight = function() {
            return 440;//this.panel1.$element.outerHeight(true);
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

        function putCSDTemplate(CSDReason, CSDSummary) {
            api.postWithToken('csrf', {
                action: 'edit',
                title: mwConfig.wgPageName,
                prependtext: CSDReason + "\n",
                summary: CSDSummary,
                tags: 'Musa3id',
                format: 'json'
            }).done(function() {
                location.reload();
            });
        }

        function getCreator() {
            return api.get({
                action: 'query',
                prop: 'revisions',
                rvlimit: 1,
                rvprop: ['user'],
                rvdir: 'newer',
                titles: mwConfig.wgPageName
            });
        }

        function sendMessageToAuthor(Author, message) {
		    var title = new mw.Title( 'User_talk:' + Author );
		    var posterPromise = mw.messagePoster.factory.create( title );
		    posterPromise.done( function ( poster ) {
		        poster.post( 'طلب حذف سريع لصفحة ' + '[[' + mwConfig.wgPageName.replace(/_/g, " ") + ']]', 
		              message );
		    } );
/*
            api.postWithToken('csrf', {
                action: 'edit',
                title: 'User_talk:' + Author,
                appendtext: '\n' + message +'\n--~~~~' ,
                summary: 'طلب حذف سريع لصفحة ' + '[[' + mwConfig.wgPageName.replace(/_/g, " ") + ']]',
                tags: 'Musa3id',
                format: 'json'
            }).done(function() {});
*/
        }

        function showProgress() {
            var processStartedDialog = new OO.ui.MessageDialog();
            var progressBar = new OO.ui.ProgressBarWidget();
            var windowManager = new OO.ui.WindowManager();
            $(document.body).append(windowManager.$element);
            windowManager.addWindows([processStartedDialog]);
            windowManager.openWindow(processStartedDialog, {
                title: 'جاري تنفيذ الطلب ....',
                message: progressBar.$element
            });
        }
    });
});
/* </nowiki> */