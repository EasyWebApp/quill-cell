# Quill Cell

**HTML Rich-text editor** element based on [Web Components][1], [WebCell v2][2] & [Quill][3].

[![NPM Dependency](https://david-dm.org/EasyWebApp/quill-cell.svg)][4]
[![CI & CD](https://github.com/EasyWebApp/quill-cell/workflows/CI%20&%20CD/badge.svg)][5]

[![NPM](https://nodei.co/npm/file-cell.png?downloads=true&downloadRank=true&stars=true)][6]

## Usage

```tsx
import { documentReady, render, createCell } from 'web-cell';
import { QuillCellProps, QuillCell } from 'quill-cell';

const upload: QuillCellProps['upload'] = async file => {
    const response = await fetch('/file', {
        method: 'POST',
        body: file
    });
    const { path } = await response.json();

    return path;
};

documentReady.then(() =>
    render(
        <QuillCell name="content" upload={upload}>
            Operate after selecting
        </QuillCell>
    )
);
```

[1]: https://www.webcomponents.org/
[2]: https://web-cell.dev/
[3]: https://quilljs.com/
[4]: https://david-dm.org/EasyWebApp/quill-cell
[5]: https://github.com/EasyWebApp/quill-cell/actions
[6]: https://nodei.co/npm/file-cell/
