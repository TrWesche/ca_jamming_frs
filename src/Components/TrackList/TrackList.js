import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

// Always check that the variables are ready to be used or React will throw a stupid error that is non-descript and hard to figure out.....

export class TrackList extends React.Component {
    render () { 
        if (this.props.tracks) {
            return (
                <div className="TrackList">
                    {
                        this.props.tracks.map(track => 
                            <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>
                        )
                    }
                </div>
            );
        }
        return <h3> </h3>
    }
}


        // // console.log(this.props.tracks[0]);
        // const tracks = this.props.tracks;
        // console.log(tracks[0]);
        // const trackList = tracks.map(track => 
        //     {
        //         return <Track key={track.id} track={track} />
        //     });