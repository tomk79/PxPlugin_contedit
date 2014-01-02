<?php

/**
 * PX Plugin "contedit" models/content
 */
class pxplugin_contedit_models_content{

	private $px;
	private $page_info;
	private $cont_info;
	private $plugin_obj;
	private $data;

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
		$this->data = $this->load_contents_data();

		$this->cont_info = $this->parse_content_info($this->page_info);
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
		return $rtn;
	}

	/**
	 * コンテンツのデータをロードする。
	 */
	private function load_contents_data(){
		// UTODO: 実装してください。
		$rtn = array();
		return $rtn;
	}//load_contents_data()

	/**
	 * コンテンツデータ一式を取得する
	 */
	public function get(){
		return $this->data;
	}//get()

	/**
	 * コンテンツデータ一式をセットする
	 */
	public function set( $data ){
		$this->data = $data;
		return true;
	}//set()

	/**
	 * 編集したデータを保存する。
	 */
	public function save(){
		// UTODO: 実装してください。
		if( !$this->validate_pageinfo($this->page_info) ){
			return false;
		}

		$cont_info = $this->cont_info;
		// test::var_dump($cont_info);

		return true;
	}//save()

}

?>