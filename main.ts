import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';  

// 记得重命名这些类和接口！  

interface MyPluginSettings {  
    mySetting: string;  
}  

const DEFAULT_SETTINGS: MyPluginSettings = {  
    mySetting: '默认值'  
}  

export default class MyPlugin extends Plugin {  
    settings: MyPluginSettings;  
//onload() 生命周期函数在用户激活 Obsidian 插件时触发。这将是您设置插件大部分功能的地方。该方法在插件更新时也会被触发。
    async onload() {  
        await this.loadSettings();  

        // 这在左侧工具栏创建一个图标。  
        const ribbonIconEl = this.addRibbonIcon('dice', '随机一句古诗', (evt: MouseEvent) => {  
            // 当用户点击图标时调用。  
            new Notice('乘风破浪会有时,直挂云帆济沧海');  
        });  
		
        // 对工具栏的其他操作  
        ribbonIconEl.addClass('my-plugin-ribbon-class');  

        // 这在应用底部添加一个状态栏项目。移动应用上不适用。  
        const statusBarItemEl = this.addStatusBarItem();  
        statusBarItemEl.setText('状态栏文本');  

        // 这添加一个可以在任何地方触发的简单命令  
        this.addCommand({  
            id: 'open-sample-modal-simple',  
            name: '打开示例模态框（简单）',  
            callback: () => {  
                new SampleModal(this.app).open();  
            }  
        });  
        // 这添加一个编辑器命令，可以对当前编辑器实例执行一些操作  
        this.addCommand({  
            id: 'sample-editor-command',  
            name: '示例编辑器命令',  
            editorCallback: (editor: Editor, view: MarkdownView) => {  
                console.log(editor.getSelection());  
                editor.replaceSelection('示例编辑器命令');  
            }  
        });  
        // 这添加一个复杂的命令，可以检查当前应用状态是否允许执行该命令  
        this.addCommand({  
            id: 'open-sample-modal-complex',  
            name: '打开示例模态框（复杂）',  
            checkCallback: (checking: boolean) => {  
                // 检查条件  
                const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);  
                if (markdownView) {  
                    // 如果 checking 为 true，我们只是在“检查”命令是否可以运行。  
                    // 如果 checking 为 false，则我们想要实际执行操作。  
                    if (!checking) {  
                        new SampleModal(this.app).open();  
                    }  

                    // 当检查函数返回 true 时，该命令将仅在命令面板中显示  
                    return true;  
                }  
            }  
        });  

        // 这添加一个设置选项卡，以便用户可以配置插件的各个方面  
        this.addSettingTab(new SampleSettingTab(this.app, this));  

        // 如果插件挂钩了任何全局 DOM 事件（在不属于该插件的应用部分）  
        // 使用此函数将在此插件被禁用时自动移除事件监听器。  
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {  
            console.log('点击', evt);  
        });  

        // 注册间隔时，此函数将在插件被禁用时自动清除该间隔。  
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));  
    }  
//onunload() 生命周期函数在插件被禁用时触发。插件所调用的任何资源必须在这里得到释放，以防止在您的插件被禁用后对 Obsidian 的性能产生影响。
    onunload() {  
        // 卸载插件时的逻辑  
    }  

    async loadSettings() {  
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());  
    }  

    async saveSettings() {  
        await this.saveData(this.settings);  
    }  
}  

class SampleModal extends Modal {  
    constructor(app: App) {  
        super(app);  
    }  

    onOpen() {  
        const {contentEl} = this;  
        contentEl.setText('哇！');  
    }  

    onClose() {  
        const {contentEl} = this;  
        contentEl.empty();  
    }  
}  

class SampleSettingTab extends PluginSettingTab {  
    plugin: MyPlugin;  

    constructor(app: App, plugin: MyPlugin) {  
        super(app, plugin);  
        this.plugin = plugin;  
    }  

    display(): void {  
        const {containerEl} = this;  

        containerEl.empty();  

        new Setting(containerEl)  
            .setName('设置 #1')  
            .setDesc('这是一个设置')  
            .addText(text => text  
                .setPlaceholder('输入你的设置')  
                .setValue(this.plugin.settings.mySetting)  
                .onChange(async (value) => {  
                    this.plugin.settings.mySetting = value;  
                    await this.plugin.saveSettings();  
                }));  
    }  
}