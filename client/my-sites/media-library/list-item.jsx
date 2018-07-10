/** @format */

/**
 * External dependencies
 */

import { assign, isEqual, noop, omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Spinner from 'components/spinner';
import Gridicon from 'gridicons';
import ListItemImage from './list-item-image';
import ListItemVideo from './list-item-video';
import ListItemAudio from './list-item-audio';
import ListItemDocument from './list-item-document';
import ListItemFolder from './list-item-folder';
import { getMimePrefix } from 'lib/media/utils';
import EditorMediaModalGalleryHelp from 'post-editor/media-modal/gallery-help';
import { MEDIA_IMAGE_PHOTON } from 'lib/media/constants';

export default class extends React.Component {
	static displayName = 'MediaLibraryListItem';

	static propTypes = {
		media: PropTypes.object,
		scale: PropTypes.number.isRequired,
		maxImageWidth: PropTypes.number,
		thumbnailType: PropTypes.string,
		showGalleryHelp: PropTypes.bool,
		selectedIndex: PropTypes.number,
		onToggle: PropTypes.func,
		onEditItem: PropTypes.func,
		style: PropTypes.object,
		onEnter: PropTypes.func,
	};

	static defaultProps = {
		maxImageWidth: 450,
		thumbnailType: MEDIA_IMAGE_PHOTON,
		selectedIndex: -1,
		onToggle: noop,
		onEditItem: noop,
		onEnter: noop,
	};

	shouldComponentUpdate( nextProps ) {
		return ! (
			nextProps.media === this.props.media &&
			nextProps.scale === this.props.scale &&
			nextProps.maxImageWidth === this.props.maxImageWidth &&
			nextProps.thumbnailType === this.props.thumbnailType &&
			nextProps.selectedIndex === this.props.selectedIndex &&
			isEqual( nextProps.style, this.props.style )
		);
	}

	toggleHandler = ( media, shiftKey ) => {
		this.props.onToggle( media, shiftKey );
	};

	clickItem = e => {
		// Avoid reusing reference to Synthetic event
		// https://reactjs.org/docs/events.html#event-pooling
		const synthEvent = Object.assign( {}, e );

		this.toggleHandler( this.props.media, synthEvent.shiftKey );
	};

	renderItem = () => {
		let component;

		if ( ! this.props.media ) {
			return;
		}

		if ( this.props.media.type === 'folder' ) {
			component = ListItemFolder;
		} else {
			switch ( getMimePrefix( this.props.media ) ) {
				case 'image':
					component = ListItemImage;
					break;
				case 'video':
					component = ListItemVideo;
					break;
				case 'audio':
					component = ListItemAudio;
					break;
				default:
					component = ListItemDocument;
					break;
			}
		}

		return React.createElement( component, this.props );
	};

	renderSpinner = () => {
		if ( ! this.props.media || ! this.props.media.transient ) {
			return;
		}

		return (
			<div className="media-library__list-item-spinner">
				<Spinner />
			</div>
		);
	};

	render() {
		let title, selectedNumber;

		const classes = classNames( 'media-library__list-item', {
			'is-placeholder': ! this.props.media,
			'is-selected': -1 !== this.props.selectedIndex,
			'is-transient': this.props.media && this.props.media.transient,
			'is-small': this.props.scale <= 0.125,
		} );

		const props = omit( this.props, Object.keys( this.constructor.propTypes ) );

		const style = assign(
			{
				width: this.props.scale * 100 + '%',
			},
			this.props.style
		);

		if ( this.props.media ) {
			title = this.props.media.file;
		}

		if ( -1 !== this.props.selectedIndex ) {
			selectedNumber = this.props.selectedIndex + 1;
			props[ 'data-selected-number' ] = selectedNumber > 99 ? '99+' : selectedNumber;
		}

		return (
			<Fragment>
				{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */ }
				<div className={ classes } style={ style } onClick={ this.clickItem } { ...props }>
					<span className="media-library__list-item-selected-icon">
						<Gridicon icon="checkmark" size={ 24 } />
					</span>
					<figure className="media-library__list-item-figure" title={ title }>
						{ this.renderItem() }
						{ this.renderSpinner() }
						{ this.props.showGalleryHelp && <EditorMediaModalGalleryHelp /> }
					</figure>
				</div>
			</Fragment>
		);
	}
}
