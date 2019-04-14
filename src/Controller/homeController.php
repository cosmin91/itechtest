<?php

namespace App\Controller;

use League\Csv\Reader;
use League\Csv\Writer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class homeController extends Controller
{
    /**
     * @Route("/")
     * @Method({"GET"})
     */
    public function index()
    {
        return $this->render('home/index.html.twig');
    }

    /**
     * @Route("/api/save")
     * @Method({"POST"})
     */
    public function saveCSV()
    {
        function get_client_ip_env()
        {
            $ipaddress = '';
            if (getenv('HTTP_CLIENT_IP')) {
                $ipaddress = getenv('HTTP_CLIENT_IP');
            } else if (getenv('HTTP_X_FORWARDED_FOR')) {
                $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
            } else if (getenv('HTTP_X_FORWARDED')) {
                $ipaddress = getenv('HTTP_X_FORWARDED');
            } else if (getenv('HTTP_FORWARDED_FOR')) {
                $ipaddress = getenv('HTTP_FORWARDED_FOR');
            } else if (getenv('HTTP_FORWARDED')) {
                $ipaddress = getenv('HTTP_FORWARDED');
            } else if (getenv('REMOTE_ADDR')) {
                $ipaddress = getenv('REMOTE_ADDR');
            } else {
                $ipaddress = 'UNKNOWN';
            }

            return $ipaddress;
        }
        // get params
        $request = Request::createFromGlobals();
        $data = $request->request->all();
        // get ip
        $ip = get_client_ip_env();
        // get date - formated
        $time = date('H:i:s \O\n d/m/Y');
        // file path
        $file_path = 'csv/csvCalculator.csv';
        $csv = Writer::createFromPath($file_path, 'w+');

        if (file_exists($file_path)) {
            // push existing data
            $reader = Reader::createFromPath($file_path, 'r');
            $results = $reader->fetch();
            $csv->insertAll($results);
        }

        $string = array($ip, $data["total"], $_SERVER['HTTP_USER_AGENT'], $time, time());

        $csv->insertOne($string);

        die;
    }

    /**
     * @Route("/calculations")
     * @Method({"GET"})
     */
    public function calculation()
    {
        return $this->render('home/calculations.html.twig');
    }

    
    /**
     * @Route("/api/getdata")
     * @Method({"GET"})
     */
    public function getCSVData()
    {
        $file_path = 'csv/csvCalculator.csv';
        if (file_exists($file_path)) {
            $reader = Reader::createFromPath($file_path, 'r');
            $results = $reader->fetch();

            $calculations["data"] = array();
            foreach ($results as $row) {
                array_push($calculations["data"], $row);
            }
        }

        return new Response(json_encode($calculations));
    }


}
