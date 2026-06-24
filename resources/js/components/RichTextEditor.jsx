import React, { useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const hasMarkup = (value) => /<\/?[a-z][\s\S]*>/i.test(value || '');

const toEditorHtml = (value) => {
  if (!value) return '';
  if (hasMarkup(value)) return value;

  return value
    .split(/\n{2,}/)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

export default function RichTextEditor({ value, onChange, placeholder = 'Write the full article body here...' }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    const nextValue = toEditorHtml(value);
    if (editor && editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
  }, [value]);

  const emitChange = () => onChange(editorRef.current?.innerHTML || '');

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = selectionRef.current;
    if (!range) return;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const command = (name, commandValue = null) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(name, false, commandValue);
    emitChange();
  };

  const addLink = async () => {
    saveSelection();
    const selectedText = selectionRef.current?.toString().trim();
    const { isConfirmed, value: url } = await Swal.fire({
      title: 'Add Link',
      input: 'url',
      inputLabel: 'Enter the link URL',
      inputPlaceholder: 'https://example.com',
      showCancelButton: true,
      confirmButtonText: 'Add Link',
      cancelButtonText: 'Cancel',
      inputValidator: value => {
        if (!value?.trim()) return 'Please enter a link URL.';
        const normalized = value.trim().replace(/^www\./i, 'https://');
        return /^(https?:|mailto:|\/|#)/i.test(normalized)
          ? undefined
          : 'Use an http(s), mailto, relative, or anchor link.';
      }
    });
    if (!isConfirmed || !url?.trim()) return;

    const href = url.trim().replace(/^www\./i, 'https://');
    if (selectedText) {
      command('createLink', href);
      return;
    }

    const { isConfirmed: hasLinkText, value: linkText } = await Swal.fire({
      title: 'Link Text',
      input: 'text',
      inputLabel: 'Text to display',
      inputPlaceholder: 'Read more',
      showCancelButton: true,
      confirmButtonText: 'Insert Link',
      cancelButtonText: 'Cancel',
      inputValidator: value => value?.trim() ? undefined : 'Please enter the link text.'
    });
    if (!hasLinkText || !linkText?.trim()) return;

    editorRef.current?.focus();
    restoreSelection();
    const escapedHref = href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const escapedText = linkText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    document.execCommand('insertHTML', false, `<a href="${escapedHref}">${escapedText}</a>`);
    emitChange();
  };

  return (
    <div className="rich-text-editor">
      <div
        className="rich-text-editor__toolbar"
        role="toolbar"
        aria-label="Article formatting"
        onMouseDown={event => {
          if (event.target.closest('button')) event.preventDefault();
        }}
      >
        <button type="button" onClick={() => command('bold')} title="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => command('italic')} title="Italic"><em>I</em></button>
        <button type="button" onClick={() => command('underline')} title="Underline"><u>U</u></button>
        <span className="rich-text-editor__divider" />
        <button type="button" onClick={() => command('formatBlock', 'h2')} title="Heading">H2</button>
        <button type="button" onClick={() => command('formatBlock', 'h3')} title="Subheading">H3</button>
        <button type="button" onClick={() => command('formatBlock', 'p')} title="Paragraph">P</button>
        <span className="rich-text-editor__divider" />
        <button type="button" onClick={() => command('insertUnorderedList')} title="Bulleted list">• List</button>
        <button type="button" onClick={() => command('insertOrderedList')} title="Numbered list">1. List</button>
        <button type="button" onClick={() => command('formatBlock', 'blockquote')} title="Quote">❝</button>
        <button type="button" onClick={addLink} title="Add link">↗ Link</button>
        <button type="button" onClick={() => command('removeFormat')} title="Clear formatting">Clear</button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-editor__content"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={emitChange}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        suppressContentEditableWarning
      />
    </div>
  );
}
