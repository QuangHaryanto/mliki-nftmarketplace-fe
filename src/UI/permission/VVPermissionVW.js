import React from 'react';

class VVPermissionVW extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }
  render() {
    return (
        <div class="permission">
            <div class="permission__img">
            <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
</svg>
            </div>
            <div class="permission__title">
                <h2 className='color_white'>Permission Denied</h2>
            </div>
        </div>
    );
  }
}

export default VVPermissionVW;
