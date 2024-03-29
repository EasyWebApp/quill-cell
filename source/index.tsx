import {
    WebFieldProps,
    component,
    mixinForm,
    watch,
    attribute,
    createCell
} from 'web-cell';
import { TextFieldProps, importCSS } from 'web-utility';
import Quill, { QuillOptionsStatic } from 'quill';

import './index.less';

export interface QuillCellProps extends TextFieldProps, WebFieldProps {
    theme: 'bubble' | 'snow';
    options?: QuillOptionsStatic;
    upload?: (file: File) => Promise<string>;
}

@component({
    tagName: 'quill-cell',
    renderTarget: 'children'
})
export class QuillCell extends mixinForm<QuillCellProps>() {
    get type() {
        return 'textarea';
    }

    @attribute
    @watch
    theme: QuillCellProps['theme'];

    @attribute
    @watch
    readOnly?: boolean;

    @attribute
    @watch
    placeholder?: string;

    @watch
    options?: QuillOptionsStatic;

    @watch
    upload?: QuillCellProps['upload'];

    protected box?: Quill;

    @watch
    // @ts-ignore
    set defaultValue(defaultValue: string) {
        this.setProps({ defaultValue }).then(
            () => (this.box.root.innerHTML = defaultValue)
        );
    }
    // @ts-ignore
    set value(value: string) {
        const { box } = this;

        this.setProps({ value });

        if (!box) return;

        this.internals.setFormValue(value);
        box.root.innerHTML = value;
    }

    get value() {
        return this.box?.root.innerHTML || this.props.value;
    }

    async connectedCallback() {
        await importCSS(
            `https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.${this.theme}.css`
        );
        super.connectedCallback();
    }

    /**
     * @see https://quilljs.com/docs/modules/toolbar/#container
     */
    protected boot = async (node: HTMLElement) => {
        const { theme, readOnly, placeholder, upload, options, value } = this;

        const SizeStyle = Quill.import('attributors/style/size');
        SizeStyle.whitelist = ['12px', '14px', '16px', '18px', '20px'];

        Quill.register(SizeStyle, true);

        if (theme === 'snow')
            Quill.register(
                'modules/imageUploader',
                (await import('quill-image-uploader')).default
            );

        this.box = new Quill(node, {
            theme,
            readOnly,
            placeholder,
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ header: 1 }, { header: 2 }], // custom button values
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction

                    [{ size: SizeStyle.whitelist }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],

                    ...(theme === 'snow' ? [['image']] : []),

                    ['clean'] // remove formatting button
                ],
                ...(upload && { imageUploader: { upload } })
            },
            ...options
        });

        this.box.root.innerHTML = value;

        node.addEventListener('input', () =>
            this.internals.setFormValue(this.value)
        );
    };

    updatedCallback() {
        const { defaultValue } = this.props;

        if (!(defaultValue != null) && this.box)
            return this.setProps({ defaultValue: this.box.root.innerHTML });
    }

    render({ theme, defaultSlot }: QuillCellProps) {
        return (
            <div
                className={theme === 'bubble' ? 'form-control p-0' : undefined}
                ref={this.boot}
            >
                {defaultSlot}
            </div>
        );
    }
}
