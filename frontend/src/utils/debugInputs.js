/**
 * Debug utility to diagnose input field issues in admin panel
 */

export const debugInputFields = () => {
  console.log('🔍 Starting input field diagnostics...');
  
  // Check all input fields on the page
  const allInputs = document.querySelectorAll('input, textarea, select');
  console.log(`📊 Found ${allInputs.length} form controls on page`);
  
  allInputs.forEach((input, index) => {
    const styles = window.getComputedStyle(input);
    const isTextInput = ['text', 'email', 'password', 'url', 'number', 'search', 'tel'].includes(input.type || '');
    
    if (isTextInput || input.tagName === 'TEXTAREA') {
      console.log(`📝 Text Input ${index + 1}:`, {
        type: input.type || input.tagName,
        id: input.id,
        name: input.name,
        className: input.className,
        disabled: input.disabled,
        readOnly: input.readOnly,
        pointerEvents: styles.pointerEvents,
        userSelect: styles.userSelect,
        cursor: styles.cursor,
        zIndex: styles.zIndex,
        position: styles.position,
        visibility: styles.visibility,
        opacity: styles.opacity,
        transform: styles.transform
      });
      
      // Check if input can receive focus
      try {
        input.focus();
        console.log(`✅ Input ${index + 1} can receive focus`);
      } catch (error) {
        console.log(`❌ Input ${index + 1} cannot receive focus:`, error);
      }
      
      // Check for event listeners
      const hasKeydownListeners = input.onkeydown !== null;
      const hasKeypressListeners = input.onkeypress !== null;
      const hasKeyupListeners = input.onkeyup !== null;
      const hasInputListeners = input.oninput !== null;
      
      if (hasKeydownListeners || hasKeypressListeners || hasKeyupListeners || hasInputListeners) {
        console.log(`🎭 Input ${index + 1} has event listeners:`, {
          keydown: hasKeydownListeners,
          keypress: hasKeypressListeners,
          keyup: hasKeyupListeners,
          input: hasInputListeners
        });
      }
    }
  });
  
  // Check for global event listeners that might interfere
  console.log('🌐 Checking for global event listeners...');
  
  // Test if we can programmatically set value
  const testInput = document.querySelector('input[type="text"]');
  if (testInput) {
    console.log('🧪 Testing programmatic input...');
    const originalValue = testInput.value;
    testInput.value = 'TEST_VALUE_' + Date.now();
    console.log(`📝 Set test value: ${testInput.value}`);
    testInput.value = originalValue;
    console.log(`↩️  Restored original value: ${testInput.value}`);
  }
  
  console.log('✅ Input field diagnostics complete');
};

export const enableInputs = () => {
  console.log('🔧 Force enabling all input fields...');
  
  const allInputs = document.querySelectorAll('input, textarea, select');
  allInputs.forEach((input, index) => {
    const isTextInput = ['text', 'email', 'password', 'url', 'number', 'search', 'tel'].includes(input.type || '');
    
    if (isTextInput || input.tagName === 'TEXTAREA') {
      // Force enable input
      input.style.pointerEvents = 'auto';
      input.style.userSelect = 'text';
      input.style.cursor = 'text';
      input.style.touchAction = 'manipulation';
      input.disabled = false;
      input.readOnly = false;
      
      console.log(`✅ Enabled input ${index + 1}: ${input.type || input.tagName}`);
    }
  });
  
  console.log('🎯 All inputs force enabled');
};

// Auto-run diagnostics if in development
if (process.env.NODE_ENV === 'development') {
  // Run diagnostics after a short delay to ensure DOM is ready
  setTimeout(debugInputFields, 2000);
}