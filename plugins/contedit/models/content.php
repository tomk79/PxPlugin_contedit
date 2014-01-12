<?php

/**
 * PX Plugin "contedit" models/content
 */
class pxplugin_contedit_models_content{

	private $px;
	private $page_info;
	private $cont_info;
	private $plugin_obj;
	private $cont_data;

	/**
	 * コンストラクタ
	 * @param $px = PxFWコアオブジェクト
	 * @param $page_info = ページ情報
	 * @param $plugin_obj = プラグインオブジェクト
	 */
	public function __construct( $px, $page_info, $plugin_obj ){
		$this->px = $px;
		$this->page_info = $page_info;
		$this->plugin_obj = $plugin_obj;

		$this->cont_info = $this->parse_content_info($this->page_info);

		$this->cont_data = $this->load_contents_data();
	}

	/**
	 * ページ情報を精査する
	 */
	private function validate_pageinfo( $page_info ){
		if( !preg_match( '/^\//', $page_info['content'] ) ){
			// スラッシュで始まらないコンテンツは編集できない。
			return false;
		}
		return true;
	}

	/**
	 * コンテンツの情報を解析する
	 */
	private function parse_content_info( $page_info ){
		$rtn = array();
		$rtn['path_content'] = $page_info['content'];
		$rtn['path_content'] = preg_replace( '/\/$/', '/'.$this->px->get_directory_index_primary(), $rtn['path_content'] );
		$rtn['realpath_content'] = $this->px->dbh()->get_realpath( './'.$rtn['path_content'] );
		$rtn['path_files_dir'] = t::trimext( $rtn['path_content'] ).'.files/';
		$rtn['realpath_files_dir'] = t::trimext( $rtn['realpath_content'] ).'.files/';
		$rtn['path_content_dir'] = dirname($rtn['path_content']).'/';
		$rtn['realpath_content_dir'] = dirname($rtn['realpath_content']).'/';
		$rtn['path_contedit_src_dir'] = $rtn['path_files_dir'].'contedit.src.nopublish/';
		$rtn['realpath_contedit_src_dir'] = $rtn['realpath_files_dir'].'contedit.src.nopublish/';
		return $rtn;
	}

	/**
	 * コンテンツのデータをロードする。
	 */
	private function load_contents_data(){
		if( !$this->validate_pageinfo($this->page_info) ){
			return false;
		}

		$cont_info = $this->cont_info;

		$rtn = array();

		// ファイルとして保存する。
		if( $this->px->dbh()->is_file( $cont_info['realpath_contedit_src_dir'].'content_src.json' ) ){
			$rtn = $this->px->dbh()->file_get_contents( $cont_info['realpath_contedit_src_dir'].'content_src.json' );
			$rtn = json_decode( $rtn );
		}
		return $rtn;
	}//load_contents_data()

	/**
	 * コンテンツデータ一式を取得する
	 */
	public function get(){
		return $this->cont_data;
	}//get()

	/**
	 * コンテンツデータ一式をセットする
	 */
	public function set( $data ){
		$this->cont_data = $data;
		return true;
	}//set()

	/**
	 * 編集したデータを保存する。
	 */
	public function save(){
		if( !$this->validate_pageinfo($this->page_info) ){
			return false;
		}

		$cont_info = $this->cont_info;
		if( !$this->px->dbh()->is_dir( $cont_info['realpath_content_dir'] ) ){
			if( !$this->px->dbh()->mkdir_all( $cont_info['realpath_content_dir'] ) ){
				return false;
			}
		}
		if( !$this->px->dbh()->is_dir( $cont_info['realpath_files_dir'] ) ){
			if( !$this->px->dbh()->mkdir( $cont_info['realpath_files_dir'] ) ){
				return false;
			}
		}
		if( !$this->px->dbh()->is_dir( $cont_info['realpath_contedit_src_dir'] ) ){
			if( !$this->px->dbh()->mkdir( $cont_info['realpath_contedit_src_dir'] ) ){
				return false;
			}
		}

		// ファイルとして保存する
		if( !$this->px->dbh()->file_overwrite( $cont_info['realpath_contedit_src_dir'].'content_src.json', json_encode( $this->cont_data ) ) ){
			return false;
		}
		$this->cont_data = $this->load_contents_data();//リロードする

		return true;
	}//save()

	/**
	 * コンテンツHTMLをビルドする
	 */
	public function build(){
		$cont_info = $this->cont_info;
		$cont_data = $this->cont_data;
		$mod_modules = $this->plugin_obj->factory_model_modules();

		$src = '';

		foreach( $cont_data as $cont_element ){
			$mod_module = $mod_modules->get_module( $cont_element->module_id );

			foreach( $mod_module['template'] as $tpl_elm ){
				if( $tpl_elm['type'] == 'text' ){
					$src .= $tpl_elm['content'];
				}elseif( $tpl_elm['type'] == 'func' ){
					$contElmData = $cont_element->content_data->$tpl_elm['edit_element_id'];
					$src .= $contElmData->src;
				}
			}
			unset( $mod_module );
		}

		// 出来上がったソースでコンテンツを上書き
		if( !$this->px->dbh()->file_overwrite( $cont_info['realpath_content'], $src ) ){
			return false;
		}

		return true;
	}

}

?>