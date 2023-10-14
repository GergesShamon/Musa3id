/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Article for deletion
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
	var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
	var api = new mw.Api();
	var NominatedPreviously;
	var nextNominationNumber = 0;
	var afdSendMessageToCreator = localStorage.getItem("afdSendMessageToCreator") == "true";
	var afdLogNominatedPages = localStorage.getItem("afdLogNominatedPages") == "true";
	console.log(afdLogNominatedPages);

	function ArticleForDeletionDialog(config) {
		ArticleForDeletionDialog.super.call(this, config);
	}
	OO.inheritClass(ArticleForDeletionDialog, OO.ui.ProcessDialog);
	ArticleForDeletionDialog.static.name = 'ArticleForDeletionDialog';
	ArticleForDeletionDialog.static.title = 'Musa3id (Beta) - نقاش حول الحذف';
	ArticleForDeletionDialog.static.actions = [{
		action: 'save',
		label: 'متابعة',
		flags: ['primary', 'progressive']
	}, {
		label: 'إلغاء',
		flags: 'safe'
	}];
	ArticleForDeletionDialog.prototype.initialize = function() {
		ArticleForDeletionDialog.super.prototype.initialize.apply(this, arguments);
		var headerTitle = new OO.ui.MessageWidget({
			type: 'notice',
			inline: true,
			label: new OO.ui.HtmlSnippet('<strong>مناقشة الحذف</strong><br><small>بدء مناقشة حذف صفحة بالرغم من فشل تلبية معايير الحذف السريع.</small>')
		});
		AfDOptions = new OO.ui.FieldsetLayout({});
		AfDOptions.addItems([
			rationaleField = new OO.ui.FieldLayout(rationaleInput = new OO.ui.MultilineTextInputWidget({
				placeholder: 'لماذا ترشح هذه الصفحة للحذف؟',
				indicator: 'required',
				value: '',
			}), {
				label: 'السبب',
				align: 'inline',
			}),
			new OO.ui.FieldLayout(new OO.ui.ToggleSwitchWidget({
				value: afdSendMessageToCreator,
				data: 'informCreator'
			}), {
				label: 'إخطار المنشئ',
				align: 'top',
				help: 'إذا تم تحديده ، فسيتم وضع نموذج إشعار على صفحة رسالة المستخدم الذي قام بإنشاء الصفحة.',
			}),
		]);
		this.content = new OO.ui.PanelLayout({
			padded: true,
			expanded: false,
			isDraggable: true
		});
		this.content.$element.append(headerTitle.$element, '<br>', AfDOptions.$element);
		this.$body.append(this.content.$element);
	};
	ArticleForDeletionDialog.prototype.getActionProcess = function(action) {
		var dialog = this;
		if(action) {
			return new OO.ui.Process(function() {
				var AFDTempalte;
				var ActionOptions = [];
				AfDOptions.items.forEach(function(Option) {
					if(Option.fieldWidget.selected) {
						ActionOptions.push({
							value: Option.fieldWidget.value,
							selected: Option.fieldWidget.selected
						});
					}
					if(Option.fieldWidget.value === true) {
						ActionOptions.push({
							value: Option.fieldWidget.value,
							data: Option.fieldWidget.data
						});
					}
				});
				ActionOptions.forEach(function(Option) {
					if(Option.data === "informCreator") {
						console.log(Option.data);
						getCreator().then(function(data) {
							var Author = data.query.pages[mw.config.get('wgArticleId')].revisions[0].user;
							if(!mw.util.isIPAddress(Author)) {
								var message = '{{نسخ:تنبيه حذف|' + mwConfig.wgPageName.replace(/_/g, " ") + '}} --~~~~';
								sendMessageToAuthor(Author, message);
							}
						});
					}
				});
				checkPreviousNominations("ويكيبيديا:نقاش الحذف/" + mwConfig.wgPageName).then(function(data) {
					if(data.query.pages["-1"]) {
						var nomCount = 0;
						console.log(nomCount);
						NominatedPreviously = false;
						AfDTemplate = '{{نسخ:حذف|' + rationaleInput.value + '}}';
						putAfDTemplate(AfDTemplate, nextNominationNumber);
					} else {
						Rec(2);
					}
				});

				function Rec(nomCount) {
					checkPreviousNominations("ويكيبيديا:نقاش الحذف/" + mwConfig.wgPageName + ' ' + '(' + nomCount + ')').then(function(data) {
						if(!data.query.pages["-1"]) {
							Rec(nomCount + 1);
						} else {
							nextNominationNumber = nomCount++;
							console.log(nextNominationNumber);
							if(nextNominationNumber > 1) {
								AfDTemplate = '{{نسخ:حذف|' + rationaleInput.value + '|' + nextNominationNumber + '}}';
							} else {
								AfDTemplate = '{{نسخ:حذف|' + rationaleInput.value + '}}';
							}
							console.log(AfDTemplate);
							putAfDTemplate(AfDTemplate, nextNominationNumber);
						}
					});
				}
				dialog.close({
					action: action
				});
				showProgress();
			});
		}
		return ArticleForDeletionDialog.super.prototype.getActionProcess.call(this, action);
	};
	var windowManager = new OO.ui.WindowManager();
	$(document.body).append(windowManager.$element);
	var dialog = new ArticleForDeletionDialog({
		size: 'large',
		classes: ['afd-helper-window'],
		isDraggable: true
	});
	windowManager.addWindows([dialog]);
	windowManager.openWindow(dialog);

	function putAfDTemplate(AfDTemplate, nextNominationNumber) {
		var PageAFDX;
		if(nextNominationNumber > 1) {
			PageAFDX = mwConfig.wgPageName + ' (' + nextNominationNumber + ')';
		} else {
			PageAFDX = mwConfig.wgPageName;
		}
		api.postWithToken('csrf', {
			action: 'edit',
			title: mwConfig.wgPageName,
			prependtext: AfDTemplate + "\n",
			summary: 'هذه الصفحة مرشحة [[وب:شطب|للحذف السريع]]',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {
			createNominationPage(PageAFDX);
			logNomination(PageAFDX);
		});
	}

	function checkPreviousNominations(title) {
		return api.get({
			action: 'query',
			prop: 'revisions',
			rvlimit: 1,
			rvprop: ['user'],
			rvdir: 'newer',
			titles: title,
		});
	}

	function createNominationPage(PageAFDX) {
		api.postWithToken('csrf', {
			action: 'edit',
			title: 'ويكيبيديا:نقاش الحذف/' + PageAFDX,
			appendtext: '{{subst:مقالة للحذف/سبب الاقتراح|pg = ' + mwConfig.wgPageName.replace(/_/g, " ") 
			      + '|سبب الحذف= ' + rationaleInput.value + ' ~~~~ }}' + "\n",
			summary: 'اقتراح حذف',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {
			addNominationToAfdPage(PageAFDX);
		});
	}

	function addNominationToAfdPage(PageAFDX) {
		var date = new Date();
		var date_months = ["يناير" , "فبراير" , "مارس" , "أبريل" , "مايو" , "يونيو" , "يوليو" , "أغسطس" , "سبتمبر" , "أكتوبر" , "نوفمبر" , "ديسمبر"];
		var date_َAFD = date.getUTCDate() +' '+ date_months[date.getUTCMonth()] +' '+ date.getUTCFullYear();

        var pageContent;
		api.get({
			action: 'parse',
			page: "ويكيبيديا:نقاش الحذف",
			prop: 'wikitext',
			format: "json"
		}).done(function(data) {
			pageContent = data.parse.wikitext['*'];
			var NominatedBefore = pageContent.includes("{{حذف/للحذف|" + PageAFDX.replace(/_/g, " ") + "|");
            
			if(!NominatedBefore) {
				api.postWithToken('csrf', {
					action: 'edit',
					title: "ويكيبيديا:نقاش الحذف",
					text: pageContent.replace(/-->/g,"-->\n" + "{{حذف/للحذف|" + PageAFDX.replace(/_/g, " ") +"|"+ date_َAFD + "}}"),
					summary: "ترشيح [[ويكيبيديا:نقاش الحذف|للحذف]]: إضافة إلى القائمة.",
					//tags: 'Musa3id',
					format: 'json'
				}).done(function() {
					//addNominationToAfdLogPage(PageAFDX);
                    window.location = '/wiki/ويكيبيديا:نقاش الحذف/' + PageAFDX.replace(/_/g, " ");
				});
			}
		});
	}

	function addNominationToAfdLogPage(PageAFDX) {
		var date = new Date();
		var date_months = ["يناير" , "فبراير" , "مارس" , "أبريل" , "مايو" , "يونيو" , "يوليو" , "أغسطس" , "سبتمبر" , "أكتوبر" , "نوفمبر" , "ديسمبر"];
		var date_year = date.getUTCFullYear();
		var month_name = date_months[date.getUTCMonth()];
        var date_َAFD = date.getUTCDate() +' '+ date_months[date.getUTCMonth()] +' '+ date.getUTCFullYear();
        
		var pageContent;
		api.get({
			action: 'parse',
			page: "ويكيبيديا:نقاش الحذف/أرشيف/" + month_name + "_" + date_year,
			prop: 'wikitext',
			format: "json"
		}).done(function(data) {
			pageContent = data.parse.wikitext['*'];
			var NominatedBefore = pageContent.includes("{{حذف/للحذف|" + PageAFDX.replace(/_/g, " ") );
			//إذا تم ترشيحها من قبل
			if(!NominatedBefore) {
				api.postWithToken('csrf', {
					action: 'edit',
					title: "ويكيبيديا:نقاش الحذف/أرشيف/" + month_name + "_" + date_year,
					appendtext: "\n" + "{{حذف/للحذف|" + PageAFDX.replace(/_/g, " ")                     
                                     +"|"+ date_َAFD + "}}",
					summary: "ترشيح [[ويكيبيديا:نقاش الحذف/أرشيف/" + month_name + " " + date_year + "|الشهر الحالي]] أضيفت إلى سجلاتك.",
					//tags: 'Musa3id',
					format: 'json'
				}).done(function() {
					window.location = '/wiki/ويكيبيديا:نقاش الحذف/' + PageAFDX.replace(/_/g, " ");
				});
			} else {
				window.location = '/wiki/ويكيبيديا:نقاش الحذف/' + PageAFDX.replace(/_/g, " ");
			}
		});
	}

	function logNomination(PageAFDX) {
		if(afdLogNominatedPages) {
			api.postWithToken('csrf', {
				action: 'edit',
				title: 'User:'.concat(mwConfig.wgUserName, '/' + localStorage.getItem("afdLogPageName") + '').split(' ').join('_'),
				appendtext: "\n" + "# '''[[ويكيبيديا:نقاش الحذف/" + PageAFDX.replace(/_/g, " ") + "|" + mwConfig.wgPageName.replace(/_/g, " ") + "]]''' رشحت هذه صفحة للحذف ~~~~~",
				summary: 'تم الاحتفاظ بسجل للصفحة المرشحة للحذف.',
				//tags: 'Musa3id',
				format: 'json'
			}).done(function() {});
		}
	}

	function getCreator() {
		return api.get({
			action: 'query',
			prop: 'revisions',
			rvlimit: 1,
			rvprop: ['user'],
			rvdir: 'newer',
			titles: mwConfig.wgPageName.replace(/_/g, " ")
		});
	}

	function sendMessageToAuthor(Author, message) {
		api.postWithToken('csrf', {
			action: 'edit',
			title: 'User_talk:' + Author,
			appendtext: '\n' + message,
			summary: '[[' + mwConfig.wgPageName.replace(/_/g, " ") + ']]' + ' مرشحة للحذف',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {});
	}

	function showProgress() {
		var processStartedDialog = new OO.ui.MessageDialog();
		var progressBar = new OO.ui.ProgressBarWidget();
		var windowManager = new OO.ui.WindowManager();
		$(document.body).append(windowManager.$element);
		windowManager.addWindows([processStartedDialog]);
		windowManager.openWindow(processStartedDialog, {
			title: ' جار ترشيح المقالة للشطب ....',
			message: progressBar.$element
		});
	}
});
/* </nowiki> */
