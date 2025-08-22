# shared-util-ng-services

v1.

## Implementation guide

Here we manipulate the DOM for different purposes.

**Note!** This service WILL NOT work in a SSR environment.

### Insert a content or style

```ts
import { V1HtmlEditorService } from '@x/shared-util-ng-services';
const htmlEditor = new V1HtmlEditorService();

// We can place a 'placeholder' tag somewhere in the html, and ask the service
// to replace it with our desired content.
V1HtmlEditorService.insertContent('my new content', 'he-placeholder');
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    Some content. <br />
    <he-placeholder></he-placeholder>
    Some more content.
  </body>
</html>
```

### Insert a script

```ts
import { V1HtmlEditorService } from '@x/shared-util-ng-services';

V1HtmlEditorService.insertScript(`https://www.site.com/scripts/js?id=123`);

V1HtmlEditorService.insertScript(
  `
  let sth = 'something';
  `,
);
```

### Edit the title

```ts
import { V1HtmlEditorService } from '@x/shared-util-ng-services';

V1HtmlEditorService.editTitle(`app name`);
```
