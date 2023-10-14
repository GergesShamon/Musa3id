/* 

 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Loader
 */
/* <nowiki> */

var toolname = 'Musa3id'
var scriptpathbefore = mw.util.wikiScript('index') + '?title=',
	scriptpathafter = '&action=raw&ctype=text/javascript';


    var mwConfig = mw.config.get(["skin", "wgAction", "wgPageName", "wgNamespaceNumber", "wgTitle", "wgUserGroups", "wgUserName"]);
    api = new mw.Api();
    checkOptions('User:' + mwConfig.wgUserName + '/'+toolname+'-options.js').then(function(data) {
        if (data.query.pages["-1"]) {
            Options = JSON.stringify([{
                "name": "csdSendMessageToCreator",
                "value": false
            }, {
                "name": "csdLogNominatedPages",
                "value": false
            }, {
                "name": "csdLogPageName",
                "value": "CSD Log Adi"
            }, {
                "name": "afdSendMessageToCreator",
                "value": false
            }, {
                "name": "afdLogNominatedPages",
                "value": false
            }, {
                "name": "afdLogPageName",
                "value": "AfD Log Adi"
            }, {
                "name": "prdSendMessageToCreator",
                "value": false
            }, {
                "name": "prdLogNominatedPages",
                "value": false
            }, {
                "name": "prdLogPageName",
                "value": "Propose Deletion Log"
            }, {
                "name": "afdNominateOpinionsLog",
                "value": false
            }, {
                "name": "afdOpinionLogPageName",
                "value": "AfD Opinion Log"
            }, {
                "name": "showMyStatus",
                "value": false
            }, {
                "name": "MyStatus",
                "value": true
            }]);
            var params = {
                action: 'edit',
                title: 'User:' + mwConfig.wgUserName + '/'+toolname+'-options.js',
                appendtext: Options,
                summary: 'Created setting file',
                format: 'json'
            };
            api = new mw.Api();
            api.postWithToken('csrf', params).done(function() {
                //location.reload();
            });
        } else {
            var userSettingsParams = {
                action: 'parse',
                page: 'User:' + mwConfig.wgUserName + '/'+toolname+'-options.js',
                prop: 'wikitext',
                format: "json"
            };
            api.get(userSettingsParams).done(function(data) {
                var ToolOptions = JSON.parse([data.parse.wikitext['*']]);
                for (var i in ToolOptions) {
                    localStorage.setItem((ToolOptions[i]).name, (ToolOptions[i]).value);
                }
            });
        }
    });
    var DefaultMenuItems = [];
    switch (mwConfig.wgNamespaceNumber) {
        case -1:
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 14:
        case 10:
        case 11:
        case 100:
        case 101:
        case 102:
        case 103:
        case 118:
        case 828:
        case 829:
			// LOAD MODULES
			if(mwConfig.wgNamespaceNumber === 3) {
				var UserParams = {
					action: 'query',
					meta: 'userinfo',
					uiprop: 'rights',
					format: 'json'
				};
				api.get(UserParams).then(function(data) {
					checkMentor(data.query.userinfo.id);
				});
			}
            mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-AFD-Helper.js'+scriptpathafter);
            
            //if (/(?:\?|&)(?:action|diff|oldid)=/.test(window.location.href)) 
            {
                DefaultMenuItems.push(new OO.ui.MenuOptionWidget({
                    icon: 'cancel',
                    data: 'rdr',
                    label: 'إخفاء مراجعة',
                    classes: ['Musa3id-top-rrd-menu'],
                }));
            }

            if (mwConfig.wgPageName.includes('خاص:مساهمات') || mwConfig.wgNamespaceNumber === 2 || mwConfig.wgNamespaceNumber === 3 && !mwConfig.wgPageName.includes(mwConfig.wgUserName)) {
                DefaultMenuItems.push(
                    new OO.ui.MenuOptionWidget({
                        icon: 'speechBubbleAdd',
                        data: 'welcome',
                        label: 'الترحيب بمستخدم',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'cancel',
                        data: 'report',
                        label: 'الإبلاغ عن مستخدم',
                    }), 
                    new OO.ui.MenuOptionWidget({
                        icon: 'stopHand',
                        data: 'warn',
                        label: 'تنبيه مستخدم',
                        classes: ['Musa3id-top-user-menu'],
					})
			);}
			if(!mwConfig.wgPageName.includes('خاص:مساهمات')) {
				DefaultMenuItems.push(
                    new OO.ui.MenuOptionWidget({
                        icon: 'add',
                        data: 1,
                        label: 'طلب حذف سريع',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'add',
                        data: 2,
                        label: 'اقتراح الحذف',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'add',
                        data: 3,
                        label: 'ترشيح للحذف',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'arrowNext',
                        data: 'pmr',
                        label: 'طلب نقل',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'lock',
                        data: 'rpp',
                        label: 'طلب حماية',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'history',
                        data: 4,
                        label: 'أحدث تغيير',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'checkAll',
                        data: 5,
                        label: 'مكتشف Copyvio',
                    }),
                    new OO.ui.MenuOptionWidget({
                        icon: 'settings',
                        data: 6,
                        label: 'تفضيلات Musa3id',
                        classes: ['Musa3id-top-settings-menu'],
                    }));
            }
            var Musa3idMenu = new OO.ui.ButtonMenuSelectWidget({
                icon: 'ellipsis',
                label: 'Adi',
                invisibleLabel: true,
                framed: false,
                title: 'تفضيلات أكثر',
                align: 'force-right',
                classes: ['Musa3id-top-selector', 'mw-indicator'],
                menu: {
                    horizontalPosition: 'end',
                    items: DefaultMenuItems,
                    classes: ['Musa3id-top-menu'],
                }
            });
            Musa3idMenu.getMenu().on('choose', function(menuOption) {
                switch (menuOption.getData()) {
                    case 1:
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-CSD.js'+scriptpathafter);
                        break;
                    case 2:
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-PRD.js'+scriptpathafter);
                        break;
                    case 3:
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-AFD.js'+scriptpathafter);
                        break;
                    case 4:
                        window.location = '/w/index.php?title=' + mwConfig.wgPageName + "&diff=cur&oldid=prev&diffmode=source";
                        break;
                    case 5:
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-COV.js'+scriptpathafter);
                        break;
                    case 6:
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-OPT.js'+scriptpathafter);
                        break;
                    case 'report':
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-AIV.js'+scriptpathafter);
                        break;
                    case 'warn':
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-WRN.js'+scriptpathafter);
                        break;
                    case 'welcome':
                        OO.ui.alert('Coming soon :)').done(function() {});
                        break;
                    case 'rdr':
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-RDR.js'+scriptpathafter);
                        break;
                    case 'pmr':
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-PMR.js'+scriptpathafter);
                        break;
                    case 'rpp':
                        mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-RPP.js'+scriptpathafter);
                        break;
                }
            });
			if(!mwConfig.wgPageName.includes('الصفحة_الرئيسية')) {
				switch(mwConfig.skin) {
					case 'vector':
						$('.mw-portlet-cactions').parent().append(Musa3idMenu.$element);
						break;
					case 'vector-2022':
						$('.vector-collapsible').append(Musa3idMenu.$element);
						break;
					case 'monobook':
						$('.mw-indicators').append(Musa3idMenu.$element);
						break;
					case 'timeless':
						$('.mw-portlet-body').append(Musa3idMenu.$element);
						break;
					case 'minerva':
						$('.page-actions-menu__list').append(Musa3idMenu.$element);
						break;
				}
				break;
			}
    }

    function checkOptions(title) {
        return api.get({
            action: 'query',
            prop: 'revisions',
            rvlimit: 1,
            rvprop: ['user'],
            rvdir: 'newer',
            titles: title,
        });
    }
    switch (mwConfig.wgNamespaceNumber) {
        case 2:
        case 3:
            var CurrentUserPage = mwConfig.wgPageName.replace(/User(\s|\_)mesaj\s*?\:\s*?(.*)/gi, "User:$2");
            checkOptions(CurrentUserPage + '/Musa3id-options.js').then(function(data) {
                if (data.query.pages["-1"]) {
                    //
                } else {
                    var XUserParams = {
                        action: 'parse',
                        page: CurrentUserPage + '/Musa3id-options.js',
                        prop: 'wikitext',
                        format: "json"
                    };
                    api.get(XUserParams).done(function(data) {
                        var ToolOptions = JSON.parse([data.parse.wikitext['*']]);
                        var ShowStatus;
                        var UserStatus;
                        $.each(ToolOptions, function() {
                            if (this.name == "showMyStatus") {
                                ShowStatus = this.value;
                            }
                        });
                        $.each(ToolOptions, function() {
                            if (this.name == "MyStatus") {
                                UserStatus = this.value;
                            }
                        });
                        if (ShowStatus) {
                            switch (UserStatus) {
                                case "active":
                                    buttonSelect = new OO.ui.ButtonOptionWidget({
                                        framed: false,
                                        label: 'Active',
                                        data: 'active',
                                        classes: ['Musa3id-user-status-active'],
                                    });
                                    $('.mw-first-heading').append(buttonSelect.$element);
                                    break;
                                case "passive":
                                    buttonSelect = new OO.ui.ButtonOptionWidget({
                                        framed: false,
                                        label: 'Passive',
                                        data: 'passive',
                                        classes: ['Musa3id-user-status-passive'],
                                    });
                                    $('.mw-first-heading').append(buttonSelect.$element);
                                    break;
                                case "away":
                                    buttonSelect = new OO.ui.ButtonOptionWidget({
                                        framed: false,
                                        label: 'Away',
                                        data: 'away',
                                        classes: ['Musa3id-user-status-away'],
                                    });
                                    $('.mw-first-heading').append(buttonSelect.$element);
                                    break;
                            }
                            var checkLoggedUserPage = mwConfig.wgPageName.includes(mwConfig.wgUserName);
                            if (checkLoggedUserPage) {
                                buttonSelect.on('click', (function() {
                                    buttonSelect.$element.hide();
                                    var dropdown = new OO.ui.DropdownWidget({
                                        menu: {
                                            items: [
                                                new OO.ui.MenuOptionWidget({
                                                    data: 'active',
                                                    label: 'Active'
                                                }),
                                                new OO.ui.MenuOptionWidget({
                                                    data: 'passive',
                                                    label: 'Passive'
                                                }),
                                                new OO.ui.MenuOptionWidget({
                                                    data: 'away',
                                                    label: 'Away'
                                                })
                                            ],
                                        },
                                        label: 'Status',
                                        classes: ['Musa3id-user-status-selector']
                                    });
                                    $('.mw-first-heading').append(dropdown.$element);
                                    dropdown.getMenu().on('choose', function(menuOption) {
                                        changeUserStatus(menuOption.getData());
                                    });
                                }));
                            }
                        }
                    });
                }
            });
            break;
    }

    function changeUserStatus(status) {
        api.get({
            action: 'parse',
            page: 'User:' + mwConfig.wgUserName + '/'+toolname+'-options.js',
            prop: 'wikitext',
            format: "json"
        }).done(function(data) {
            var ToolOptions = JSON.parse([data.parse.wikitext['*']]);
            $.each(ToolOptions, function() {
                if (this.name == "MyStatus") {
                    this.value = status;
                }
            });
            console.log(ToolOptions);
            api.postWithToken('csrf', {
                action: 'edit',
                title: 'User:' + mwConfig.wgUserName + '/'+toolname+'-options.js',
                text: JSON.stringify(ToolOptions),
                summary: 'Updated [[WP:Musa3id|Musa3id]] settings.',
                format: 'json'
            }).done(function() {
                location.reload();
            });
        });
    }

    function checkMentor(UserId) {
		api.get({
			action: 'parse',
			page: "MediaWiki:GrowthMentors.json",
			prop: 'wikitext',
			format: "json"
		}).done(function(data) {
			if(data.parse.wikitext['*'].includes(UserId) && mwConfig.wgPageName.includes(mwConfig.wgUserName)) {
                mw.loader.load(scriptpathbefore+'MediaWiki:Gadget-Musa3id-CMR.js'+scriptpathafter);
            }
        });
    }

/* </nowiki> */
