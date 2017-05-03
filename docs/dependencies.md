# Dependencies

Dependencies should be updated when there is a critical security or business reason for doing so.


## Notes

_These notes should be reviewed when dependencies are updated to ensure they remain relevant:_

- Resumable JS is referenced directly from Github (`23/resumable.js`) rather than npm due to the latest npm release (`v1.0.2`) being from March 2015, and lacking many of the latest improvements to the codebase. 

- The following dependencies have been fixed to `15.4.2` in order to remove deprecation issues for `React.PropTypes` and `React.createClass` caused by third-party dependencies. ([Further information](https://github.com/facebook/react/releases/tag/v15.5.0))

	- `react-addons-test-utils`
	- `react-test-renderer`
	- `react`
	- `react-dom`
